import React from "react";

function Hero() {
  return (
    <div>
      <section>
        <div className="mx-auto px-6 md:max-w-[68%] lg:px-32 py-16 md:py-24 lg:flex">
          <div className="mx-auto x-32 text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl text-primary">
              File-forge
            </h1>

            <p className="mt-7 text-[1rem] md:text-[1.2rem] text-secondary">
              Convert any image file to the format you need, We support nearly
              all
              {/* audio, video, */} image
              {/* and document  */} formats.
              {/* we've got you covered. */} Simply upload your files and let us
              do the rest.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
