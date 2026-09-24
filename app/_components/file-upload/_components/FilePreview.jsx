"use client";

import { CircleX, FileImage, AlertCircle } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import FlowArrow from "../../FlowArrow";
import {
  convertTo,
  readImageDimensions,
  checkAvifEncodeSupport,
} from "@/app/utils/convertFile";
import { SUPPORTED_FORMATS, FORMAT_CATEGORY_ORDER } from "@/app/constants/ContentConstant";

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// jpg/jpeg are the same underlying format — never offer converting to itself.
function normalizeFamily(ext) {
  return ext === "jpeg" ? "jpg" : ext;
}

function FilePreview({ file, removeFile }) {
  const [status, setStatus] = useState("idle"); // idle | converting | done | error
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [quality, setQuality] = useState(0.92);
  const [convertedFile, setConvertedFile] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [highlightStyle, setHighlightStyle] = useState({ opacity: 0 });
  const [avifSupported, setAvifSupported] = useState(false);

  const pillContainerRef = useRef(null);
  const pillRefs = useRef({});

  const fileExtension = file.name.split(".").pop().toLowerCase();
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState(null);

  useEffect(() => {
    checkAvifEncodeSupport().then(setAvifSupported);
  }, []);

  // Create and revoke the blob URL within the same effect run — tying
  // creation to useMemo (render phase) and revocation to a separate effect
  // meant the URL could be revoked out from under the <img> whenever an
  // effect re-runs without a fresh render (e.g. Strict Mode's dev-only
  // double-invoke), leaving the preview broken.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSourcePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    let active = true;
    readImageDimensions(file)
      .then((dims) => active && setDimensions(dims))
      .catch(() => active && setDimensions(null));
    return () => {
      active = false;
    };
  }, [file]);

  const availableFormats = SUPPORTED_FORMATS.filter((format) => {
    if (normalizeFamily(format.ext) === normalizeFamily(fileExtension)) return false;
    if (format.requiresRuntimeCheck && format.id === "avif") return avifSupported;
    return true;
  });

  const groupedFormats = FORMAT_CATEGORY_ORDER.map((category) => ({
    category,
    formats: availableFormats.filter((format) => format.category === category),
  })).filter((group) => group.formats.length > 0);

  useLayoutEffect(() => {
    const el = selectedFormat && pillRefs.current[selectedFormat];
    const container = pillContainerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHighlightStyle({
        opacity: 1,
        width: elRect.width,
        height: elRect.height,
        transform: `translate(${elRect.left - containerRect.left}px, ${
          elRect.top - containerRect.top
        }px)`,
      });
    } else {
      setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [selectedFormat, availableFormats.length]);

  const [convertedPreviewUrl, setConvertedPreviewUrl] = useState(null);

  useEffect(() => {
    if (!convertedFile) {
      setConvertedPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(convertedFile);
    setConvertedPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [convertedFile]);

  const targetFormat = SUPPORTED_FORMATS.find((f) => f.id === selectedFormat);

  const handleConvert = async () => {
    setStatus("converting");
    setErrorMessage(null);
    setProgress(12);

    const ramp = setInterval(() => {
      setProgress((prev) => (prev < 88 ? prev + (88 - prev) * 0.2 : prev));
    }, 120);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 450));

    try {
      const [result] = await Promise.all([
        convertTo(file, selectedFormat, { quality }),
        minDelay,
      ]);
      clearInterval(ramp);
      setProgress(100);
      setConvertedFile(result);
      setTimeout(() => setStatus("done"), 220);
    } catch (err) {
      clearInterval(ramp);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong during conversion.");
    }
  };

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setSelectedFormat(null);
    setConvertedFile(null);
    setErrorMessage(null);
  };

  return (
    <div className="animate-reveal">
      <div className="border rounded-2xl p-4 md:p-5 border-secondary/10 dark:border-gray-700 bg-mist dark:bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {sourcePreviewUrl ? (
              <img
                src={sourcePreviewUrl}
                alt=""
                className="w-12 h-12 rounded-lg object-cover border border-secondary/10 dark:border-gray-700 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-secondary/10 dark:border-gray-700 bg-secondary/5 dark:bg-white/5 shrink-0" />
            )}
            <div className="min-w-0">
              <h2 className="text-secondary dark:text-gray-100 font-medium truncate">
                {file.name}
              </h2>
              <p className="text-xs text-secondary/60 dark:text-gray-400 font-mono tabular-nums">
                {formatSize(file.size)}
                {dimensions ? ` · ${dimensions.width}×${dimensions.height}` : ""}
              </p>
            </div>
          </div>

          {status === "idle" && (
            <button
              type="button"
              aria-label="Remove file"
              onClick={removeFile}
              className="text-secondary/50 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors hover:rotate-90 duration-300"
            >
              <CircleX size={22} />
            </button>
          )}
        </div>

        {status === "idle" && (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-secondary/50 dark:text-gray-500 mb-2 font-mono">
              Convert to
            </p>
            <div
              ref={pillContainerRef}
              role="radiogroup"
              aria-label="Target format"
              className="relative space-y-3"
            >
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 rounded-full bg-primary dark:bg-spark transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={highlightStyle}
              />
              {groupedFormats.map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-secondary/40 dark:text-gray-500 font-mono mb-1.5">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.formats.map((format) => (
                      <label
                        key={format.id}
                        ref={(node) => {
                          pillRefs.current[format.id] = node;
                        }}
                        className="relative z-10 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="target-format"
                          value={format.id}
                          checked={selectedFormat === format.id}
                          onChange={() => setSelectedFormat(format.id)}
                          className="sr-only peer"
                        />
                        <span
                          className="inline-block px-4 py-2 rounded-full text-sm font-mono border border-secondary/15 dark:border-gray-700 text-secondary dark:text-gray-200 transition-colors duration-200
                            peer-checked:text-white peer-checked:border-transparent
                            peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary dark:peer-focus-visible:outline-spark
                            hover:border-primary/50"
                        >
                          {format.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {targetFormat?.quality && (
              <div className="mt-5 animate-reveal">
                <div className="flex items-baseline justify-between mb-2">
                  <label
                    htmlFor="quality-slider"
                    className="text-xs uppercase tracking-wide text-secondary/50 dark:text-gray-500 font-mono"
                  >
                    Quality
                  </label>
                  <span className="text-xs font-mono tabular-nums text-secondary/50 dark:text-gray-500">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  id="quality-slider"
                  type="range"
                  min={0.4}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary dark:accent-spark cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {status === "converting" && (
          <div className="mt-5" aria-live="polite">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-sm text-secondary dark:text-gray-300">
                Converting to <span className="font-mono">{targetFormat?.label}</span>…
              </p>
              <span className="text-xs font-mono tabular-nums text-secondary/50 dark:text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary/10 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-spark bg-[length:200%_100%] animate-shimmer motion-reduce:animate-none transition-[width] duration-200 shadow-[0_0_10px_rgba(255,122,69,0.45)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "error" && (
          <p
            role="alert"
            className="mt-5 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle size={16} /> {errorMessage}
          </p>
        )}

        {status === "done" && convertedFile && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-[pop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="flex flex-col items-center gap-1">
              {sourcePreviewUrl && (
                <img
                  src={sourcePreviewUrl}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover border border-secondary/10 dark:border-gray-700"
                />
              )}
              <span className="text-xs font-mono text-secondary/50 dark:text-gray-500 uppercase">
                {fileExtension}
              </span>
            </div>
            <FlowArrow className="text-primary dark:text-spark shrink-0" />
            <div className="flex flex-col items-center gap-1">
              {targetFormat?.id === "pdf" || targetFormat?.id === "ico" ? (
                <div className="w-16 h-16 rounded-lg border border-secondary/10 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-ink">
                  <FileImage className="text-primary dark:text-gray-300" size={22} />
                </div>
              ) : convertedPreviewUrl ? (
                <img
                  src={convertedPreviewUrl}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover border border-secondary/10 dark:border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg border border-secondary/10 dark:border-gray-700 bg-secondary/5 dark:bg-white/5" />
              )}
              <span className="text-xs font-mono text-primary dark:text-spark uppercase">
                {targetFormat?.label}
              </span>
            </div>
            <p className="w-full text-center text-xs text-secondary/50 dark:text-gray-500 font-mono tabular-nums">
              {formatSize(convertedFile.size)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mt-8">
        <Button
          status={status}
          disabled={!selectedFormat}
          convertedFile={convertedFile}
          onConvert={handleConvert}
          onReset={reset}
        />
      </div>
    </div>
  );
}

export default FilePreview;
