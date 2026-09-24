"use client";

import React, { useState } from "react";
import { RefreshCw, Download, RotateCcw, Check } from "lucide-react";

function Button({ status, disabled, convertedFile, onConvert, onReset }) {
  const [justDownloaded, setJustDownloaded] = useState(false);

  const handleDownload = () => {
    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", convertedFile.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setJustDownloaded(true);
    setTimeout(() => setJustDownloaded(false), 1400);
  };

  if (status === "done" && convertedFile) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          className="relative flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.97] text-white font-medium transition-all overflow-hidden"
        >
          <span
            className={`flex items-center gap-2 transition-all duration-200 ${
              justDownloaded ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <Download size={18} />
            Download
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-200 ${
              justDownloaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <Check size={18} />
            Saved
          </span>
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-secondary/20 dark:border-gray-700 text-secondary dark:text-gray-200 font-medium hover:border-primary/50 active:scale-[0.97] transition-all"
        >
          <RotateCcw size={18} />
          Convert another
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.97] text-white font-medium transition-all"
      >
        <RotateCcw size={18} />
        Try again
      </button>
    );
  }

  const isConverting = status === "converting";

  return (
    <button
      disabled={disabled || isConverting}
      onClick={onConvert}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all ${
        disabled || isConverting
          ? "bg-secondary/30 dark:bg-gray-700 cursor-not-allowed"
          : "bg-primary hover:bg-primary-hover active:scale-[0.97] cursor-pointer"
      }`}
    >
      <RefreshCw
        size={18}
        className={isConverting ? "animate-spin motion-reduce:animate-none" : ""}
      />
      {isConverting ? "Converting…" : "Convert now"}
    </button>
  );
}

export default Button;
