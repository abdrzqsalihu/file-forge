import React from "react";

function Hero() {
  return (
    <section className="px-6 pt-14 pb-8 md:pt-20 md:pb-10">
      <div className="mx-auto max-w-2xl text-center animate-reveal">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70 dark:text-spark/80 mb-3">
          Image → Image, instantly
        </p>
        <h1 className="text-3xl font-semibold sm:text-5xl text-secondary dark:text-white tracking-tight [text-wrap:balance]">
          Turn any image into
          <br className="hidden sm:block" /> exactly what you need.
        </h1>
        <p className="mt-4 text-base md:text-lg text-secondary/60 dark:text-gray-400 [text-wrap:balance]">
          Drop a PNG, JPG or WEBP below, pick the format you actually want,
          and download it. No uploads to a server, no sign-up.
        </p>
      </div>
    </section>
  );
}

export default Hero;
