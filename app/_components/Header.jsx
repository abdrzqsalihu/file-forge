import React from "react";
import { navLinks } from "../constants/ContentConstant";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-ink/80 border-b border-secondary/10 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            className="group flex items-center gap-2 text-primary dark:text-white"
            href="/"
          >
            <Logo className="group-hover:rotate-[100deg]" />
            <span className="font-semibold tracking-tight">File Forge</span>
            <span className="sr-only">Home</span>
          </a>

          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    className="relative text-secondary/70 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-white font-medium text-[0.9rem] py-2
                      after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-0 after:bg-primary dark:after:bg-spark after:transition-all after:duration-300 after:ease-out hover:after:w-full"
                    href={link.id}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
