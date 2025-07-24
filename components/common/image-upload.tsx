"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { Dispatch, SetStateAction, useState } from "react";
import imageCompression from "browser-image-compression";
import { SingleImageDropzone } from "./single-image-dropzone";
import { Button } from "../ui/button";

export function ImageUpload({
  setImage,
  className,
  maxSize = 1024 * 1024 * 2, // 2MB
}: {
  setImage: Dispatch<SetStateAction<string>>;
  className?: string;
  maxSize?: number;
}) {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState<
    "PENDING" | "COMPLETE" | "ERROR" | number
  >("PENDING");

  const handleUpload = async () => {
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5, // Target max size (e.g., 500KB)
        maxWidthOrHeight: 1080, // Max width/height to keep high quality
        useWebWorker: true, // Improve performance
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Upload the compressed file
      const res = await edgestore.publicFiles.upload({
        file: compressedFile,
        onProgressChange: async (newProgress) => {
          setProgress(newProgress);
          if (newProgress === 100) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setProgress("COMPLETE");
          }
        },
      });

      setImage(res.url);
    } catch (err) {
      console.error("Compression/Upload Error:", err);
      setProgress("ERROR");
    }
  };

  return (
    <div>
      <SingleImageDropzone
        value={file}
        onChange={(file) => {
          setFile(file);
        }}
        className={className}
        dropzoneOptions={{
          maxFiles: 1,
          maxSize,
        }}
      />
      <Button
        type="button"
        variant="secondary"
        className="mt-2 w-full"
        onClick={handleUpload}
        disabled={!file || progress !== "PENDING"}
      >
        {progress === "PENDING"
          ? "Upload"
          : progress === "COMPLETE"
            ? "Done"
            : typeof progress === "number"
              ? `Uploading (${Math.round(progress)}%)`
              : "Error"}
      </Button>
    </div>
  );
}
