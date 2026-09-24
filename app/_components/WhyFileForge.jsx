import React, { Fragment } from "react";
import FlowArrow from "./FlowArrow";
import { benefits } from "../constants/ContentConstant";

function WhyFileForge() {
  return (
    <section
      id="why"
      className="px-6 py-20 md:py-28 bg-mist dark:bg-panel border-y border-secondary/10 dark:border-gray-800"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70 dark:text-spark/80 mb-3">
          Why File Forge
        </p>
        <h2 className="text-2xl md:text-4xl font-semibold text-secondary dark:text-white tracking-tight max-w-md [text-wrap:balance]">
          Built to stay out of your way.
        </h2>

        <div className="mt-14 grid gap-10 md:gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start">
          {benefits.map((benefit, index) => (
            <Fragment key={benefit.title}>
              <div className="group relative">
                <span
                  aria-hidden="true"
                  className="block font-mono text-5xl md:text-6xl font-semibold leading-none select-none text-secondary/10 dark:text-white/10 transition-colors duration-300 group-hover:text-primary/25 dark:group-hover:text-spark/25"
                >
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-medium text-lg text-secondary dark:text-gray-100 transition-transform duration-300 group-hover:translate-x-0.5">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-secondary/60 dark:text-gray-400 md:max-w-[24ch]">
                  {benefit.description}
                </p>
              </div>

              {index < benefits.length - 1 && (
                <>
                  <FlowArrow className="hidden md:block justify-self-center mt-7 text-secondary/25 dark:text-gray-700" />
                  <FlowArrow className="md:hidden -my-3 mx-auto rotate-90 text-secondary/25 dark:text-gray-700" />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyFileForge;
