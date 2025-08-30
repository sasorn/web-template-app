import React, { createContext, useEffect } from "react";

// Create a context (though we won't be passing any values, it's good practice)
const ThemeContext = createContext();

/**
 * This provider component detects the system's color scheme and applies a
 * data-theme attribute to the <html> element. It automatically updates
 * when the system theme changes.
 */
export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * Checks the system preference and applies the 'dark' or 'light' theme.
     * @param {MediaQueryListEvent} e - The media query event object.
     */
    const handleThemeChange = e => {
      const isDark = e.matches;
      root.setAttribute("data-theme", isDark ? "dark" : "light");
    };

    // Add the listener for system theme changes
    systemPrefersDark.addEventListener("change", handleThemeChange);

    // Set the initial theme on component mount
    root.setAttribute(
      "data-theme",
      systemPrefersDark.matches ? "dark" : "light"
    );

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      systemPrefersDark.removeEventListener("change", handleThemeChange);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return <ThemeContext.Provider value={null}>{children}</ThemeContext.Provider>;
};
