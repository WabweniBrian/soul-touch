"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { Dispatch, SetStateAction, useState } from "react";
import { FileState, MultiFileDropzone } from "./multi-file-dropzone";
import { Button } from "../ui/button";

export function FilesUpload({
  setFiles,
  className,
  maxFiles = 6,
  maxSize = 1024 * 1024 * 5, //5MB
}: {
  setFiles: Dispatch<
    SetStateAction<
      {
        url: string;
        size: number;
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
      <MultiFileDropzone
        value={fileStates}
        dropzoneOptions={{
          maxFiles: maxFiles,
          maxSize: maxSize,
        }}
        className={className}
        onChange={setFileStates}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
        }}
      />
      <Button
        className="mt-2 w-full"
        variant="secondary"
        onClick={async () => {
          await Promise.all(
            fileStates.map(async (fileState) => {
              try {
                if (fileState.progress !== "PENDING") return;
                const res = await edgestore.publicFiles.upload({
                  file: fileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(fileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(fileState.key, "COMPLETE");
                    }
                  },
                });
                setFiles((uploadRes) => [
                  ...uploadRes,
                  {
                    url: res.url,
                    size: res.size,
                  },
                ]);
              } catch (err) {
                updateFileProgress(fileState.key, "ERROR");
                console.log(err);
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
