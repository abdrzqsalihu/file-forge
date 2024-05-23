"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    closeDropdown();
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          onClick={toggleDropdown}
        >
          {theme === "dark" ? (
            <Moon className="w-5 h-5 text-gray-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
          <span className="sr-only">Toggle Theme</span>
        </button>
      </div>
      {dropdownOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5  dark:border dark:border-gray-700"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <button
              className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              role="menuitem"
              onClick={() => handleThemeChange("light")}
            >
              Light
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              role="menuitem"
              onClick={() => handleThemeChange("dark")}
            >
              Dark
            </button>
            {/* <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
              onClick={() => handleThemeChange("system")}
            >
              System
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
