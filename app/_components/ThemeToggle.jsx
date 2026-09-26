"use client";
import { useTheme } from "next-themes";
import { useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  // resolvedTheme is the actual light/dark in effect — `theme` can be
  // "system", which would otherwise read as "not dark" on a dark device.
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = (event) => {
    const next = isDark ? "light" : "dark";

    // Keyboard/programmatic activation reports (0,0) — fall back to the
    // button's own center so the reveal still originates from the control.
    const usePointer = event.clientX || event.clientY;
    const origin = usePointer
      ? { x: event.clientX, y: event.clientY }
      : (() => {
          const rect = buttonRef.current?.getBoundingClientRect();
          return rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : { x: 0, y: 0 };
        })();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 1100,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-secondary/15 dark:border-gray-700 text-secondary dark:text-gray-200 hover:border-primary/50 dark:hover:border-spark/60 transition-colors"
    >
      <Sun
        size={17}
        className={`absolute text-amber-500 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isDark ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"
        }`}
      />
      <Moon
        size={17}
        className={`absolute text-spark transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
