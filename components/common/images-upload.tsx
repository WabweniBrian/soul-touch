"use client";

import { useEdgeStore } from "@/lib/edgestore";
import imageCompression from "browser-image-compression";
import { Dispatch, SetStateAction, useState } from "react";
import { FileState, MultiImageDropzone } from "./multi-image-dropzone";
import { Button } from "../ui/button";

export function ImagesUpload({
  setImages,
  className,
  maxFiles = 6,
  maxSize = 1024 * 1024 * 2, // 2MB
}: {
  setImages: Dispatch<
    SetStateAction<
      {
        url: string;
        filename: string;
      }[]
    >
  >;
  className?: string;
  maxFiles?: number;
  maxSize?: number;
}) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div>
      <MultiImageDropzone
        value={fileStates}
        dropzoneOptions={{
          maxFiles,
          maxSize,
        }}
        className={className}
        onChange={setFileStates}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
        }}
      />
      <Button
        type="button"
        className="mt-2 w-full"
        variant="secondary"
        onClick={async () => {
          await Promise.all(
            fileStates.map(async (fileState) => {
              try {
                if (
                  fileState.progress !== "PENDING" ||
                  typeof fileState.file === "string"
                ) {
                  return;
                }

                let fileToUpload = fileState.file;

                const options = {
                  maxSizeMB: 0.5, // Target ~500KB
                  maxWidthOrHeight: 1080,
                  useWebWorker: true,
                };

                fileToUpload = await imageCompression(fileState.file, options);

                const res = await edgestore.publicFiles.upload({
                  file: fileToUpload,
                  onProgressChange: async (progress) => {
                    updateFileProgress(fileState.key, progress);
                    if (progress === 100) {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(fileState.key, "COMPLETE");
                    }
                  },
                });

                setImages((uploadRes) => [
                  ...uploadRes,
                  {
                    url: res.url,
                    filename: fileToUpload.name,
                  },
                ]);
              } catch (err) {
                updateFileProgress(fileState.key, "ERROR");
              }
            }),
          );
        }}
        disabled={
          !fileStates.filter((fileState) => fileState.progress === "PENDING")
            .length
        }
      >
        Upload
      </Button>
    </div>
  );
}
