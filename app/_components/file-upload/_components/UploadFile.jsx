"use client";

import { CloudUpload, AlertCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import FilePreview from "./FilePreview";
import {
  ACCEPTED_SOURCE_EXTENSIONS,
  ACCEPTED_SOURCE_MIME,
} from "@/app/constants/ContentConstant";
import { MAX_FILE_SIZE } from "@/app/utils/convertFile";

function getExtension(file) {
  return file.name.split(".").pop().toLowerCase();
}

function UploadFile() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const spotlightRef = useRef(null);
  const dragCounter = useRef(0);

  const acceptFile = (candidate) => {
    if (!candidate) return;
    const ext = getExtension(candidate);
    if (!ACCEPTED_SOURCE_EXTENSIONS.includes(ext)) {
      setError(
        `"${candidate.name}" isn't a format File Forge can read yet. Try PNG, JPG, WEBP, GIF, BMP, AVIF, SVG, TIFF or HEIC.`
      );
      return;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      setError(
        `"${candidate.name}" is too large to convert in the browser (40MB max).`
      );
      return;
    }
    setError(null);
    setFile(candidate);
  };

  const onFileSelect = (event) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  // Written directly to the DOM (no setState) so the spotlight can track the
  // pointer at 60fps without triggering a React re-render on every move.
  const onMouseMove = (event) => {
    const node = spotlightRef.current;
    if (!node) return;
    const rect = event.currentTarget.getBoundingClientRect();
    node.style.setProperty("--x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div id="converter" className="px-6 md:max-w-[70%] mx-auto scroll-mt-24">
      {!file && (
        <div className="relative rounded-3xl">
          {/* Animated seam — only visible while a file is dragged over. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-spark to-primary bg-[length:200%_100%] animate-shimmer motion-reduce:animate-none transition-opacity duration-300 ${
              isDragging ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            role="button"
            tabIndex={0}
            aria-label="Upload an image to convert. Drag and drop, or press enter to browse your files."
            onKeyDown={onKeyDown}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onMouseMove={onMouseMove}
            onClick={() => inputRef.current?.click()}
            className={`group relative overflow-hidden flex flex-col items-center justify-center w-full h-72 md:h-96 rounded-3xl cursor-pointer border-2 transition-all duration-300 outline-none
              ${
                isDragging
                  ? "m-[2px] border-transparent bg-primary/5 dark:bg-primary/10 scale-[1.01]"
                  : "m-0 border-secondary/15 dark:border-gray-700 bg-mist dark:bg-panel hover:border-primary/40"
              }`}
          >
            <div
              ref={spotlightRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), rgba(54,0,153,0.07), transparent 45%)",
              }}
            />

            <div className="relative flex flex-col items-center justify-center pt-5 pb-10 px-6 text-center">
              <CloudUpload
                className={`text-primary dark:text-gray-200 w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 ${
                  isDragging
                    ? "-translate-y-1 scale-110"
                    : "motion-safe:animate-[float_4s_ease-in-out_infinite]"
                }`}
              />
              <p className="mt-4 text-base md:text-lg font-medium text-secondary dark:text-gray-100">
                {isDragging ? "Drop it" : "Drag an image here, or click to browse"}
              </p>
              <p className="mt-2 text-sm text-secondary/50 dark:text-gray-400 font-mono tracking-wide">
                PNG · JPG · WEBP · GIF · BMP · AVIF · SVG · TIFF · HEIC
              </p>
            </div>

            <input
              ref={inputRef}
              id="dropzone-file"
              onChange={onFileSelect}
              type="file"
              accept={ACCEPTED_SOURCE_MIME}
              className="sr-only"
              tabIndex={-1}
            />
          </div>
        </div>
      )}

      {error && !file && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-reveal"
        >
          <AlertCircle size={16} /> {error}
        </p>
      )}

      {file && <FilePreview file={file} removeFile={removeFile} />}
    </div>
  );
}

export default UploadFile;
