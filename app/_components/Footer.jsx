import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { navLinks } from "../constants/ContentConstant";

function Footer() {
  return (
    <footer className="relative">
      {/* A last echo of the drag-seam / progress bar — the same gradient
          that shows a conversion in motion closes the page out. */}
      <div
        aria-hidden="true"
        className="h-[2px] bg-gradient-to-r from-primary via-spark to-primary bg-[length:200%_100%] animate-shimmer motion-reduce:animate-none"
      />

      {/* The footer is deliberately always-dark — a fixed closing beat
          regardless of the site's light/dark theme. */}
      <div className="bg-ink text-white">
        <div className="px-6 py-20 md:py-28 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-spark/80 mb-4">
            Last step
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight [text-wrap:balance] max-w-2xl mx-auto">
            One format in. The right one out.
          </h2>
          <a
            href="#converter"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ink hover:bg-spark active:scale-[0.97] font-medium transition-all"
          >
            Convert an image
          </a>
        </div>

        <div className="px-6 py-8 border-t border-white/10">
          <div className="mx-auto max-w-screen-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <a
              href="/"
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Logo className="w-6 h-[17px] group-hover:rotate-[100deg]" />
              <span className="text-sm font-medium">File Forge</span>
            </a>

            {/* <nav aria-label="Footer">
              <ul className="flex items-center gap-6 text-sm">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.id}
                      className="relative text-white/50 hover:text-white transition-colors py-1
                        after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-spark after:transition-all after:duration-300 after:ease-out hover:after:w-full"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav> */}

            <p className="text-xs text-white/40 font-mono text-center md:text-right">
              © {new Date().getFullYear()} File Forge
              <br className="md:hidden" />
              <span className="hidden md:inline"> — </span>
              runs entirely in your browser
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-white/35 font-mono">
            Built
            {/* with */}{" "}
            {/* <span role="img" aria-label="love">
              ❤️
            </span>{" "} */}
            by{" "}
            <a
              href="https://abdrzqsalihu.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-white/55 hover:text-white transition-colors py-0.5
                after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-spark after:transition-all after:duration-300 after:ease-out hover:after:w-full"
            >
              Abdulrazaq Salihu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
