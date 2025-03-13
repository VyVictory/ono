import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 w-full flex items-center transition-all"
    >
      <div className="relative h-8 w-8">
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full text-yellow-300 shadow-sm"
            >
              🌙
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-yellow-50 rounded-full text-white shadow-sm"
            >
              ☀️
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="pl-4">{theme === "dark" ? "Nền Tối" : "Nền Sáng"}</span>
    </button>
  );
};

export default ThemeToggle;
