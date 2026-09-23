import React from "react";
import FlowArrow from "./FlowArrow";
import { SUPPORTED_FORMATS, INPUT_FORMATS } from "../constants/ContentConstant";

const SOURCE_LABELS = [...new Set(INPUT_FORMATS.map((f) => f.label))];

function FormatBadge({ label }) {
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-full border border-secondary/15 dark:border-gray-700 font-mono text-sm text-secondary dark:text-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 dark:hover:border-spark/60 hover:shadow-sm">
      {label}
    </span>
  );
}

function FormatRow({ eyebrow, labels }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-secondary/40 dark:text-gray-500 mb-3">
        {eyebrow}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {labels.map((label) => (
          <FormatBadge key={label} label={label} />
        ))}
      </div>
    </div>
  );
}

function FormatShowcase() {
  return (
    <section id="formats" className="px-6 py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-secondary dark:text-white tracking-tight">
          Bring in almost anything. Export exactly what you need.
        </h2>
        <p className="mt-3 text-secondary/60 dark:text-gray-400">
          Upload any of these, convert to any of the formats below.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5">
          <FormatRow eyebrow="Import" labels={SOURCE_LABELS} />
          <FlowArrow className="rotate-90 text-primary dark:text-spark" />
          <FormatRow eyebrow="Export" labels={SUPPORTED_FORMATS.map((f) => f.label)} />
        </div>

        <p className="mt-8 text-xs text-secondary/40 dark:text-gray-500 font-mono">
          AVIF export needs a Chromium-based browser (Chrome, Edge). Everything else works everywhere.
        </p>
      </div>
    </section>
  );
}

export default FormatShowcase;
