import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed top-0 left-0 z-40 flex flex-row items-center justify-between w-full h-18 bg-[#373B53] dark:bg-dark-purple lg:flex-col lg:w-26 lg:h-screen lg:rounded-r-2xl transition-colors duration-300">
      {/* Logo Box */}
      <div className="relative flex items-center justify-center w-18 h-18 bg-purple rounded-r-2xl overflow-hidden lg:w-26 lg:h-26 group cursor-pointer">
        {/* Hover Effect */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-purple-light rounded-tl-2xl transition-all duration-300 group-hover:h-3/5" />
        {
          <svg
            className="relative z-10 w-7 h-7 lg:w-10 lg:h-10 text-white"
            xmlns="http://w3.org"
            viewBox="0 0 28 26"
            fill="currentColor"
          >
            <path d="M14 0L28 26H0L14 0Z" className="opacity-80" />
            <path d="M14 6L23 23H5L14 6Z" fill="#F8F8FB" />
          </svg>
        }
      </div>
      {/* Navigation Items */}
      <div className="flex flex-row items-center h-full lg:flex-col lg:w-full lg:h-auto">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex items-center justify-center h-full px-6 text-dark-gray hover:text-light-bg lg:w-full lg:h-20 lg:px-0 lg:border-b lg:border-[#494E6E] transition-colors duration-200"
        >
          {theme === "dark" ? (
            <Sun className="cursor-pointer" />
          ) : (
            <Moon className="cursor-pointer" />
          )}
        </button>
        {/* Avatar*/}
        <div className="flex items-center justify-center h-full px-6 lg:w-full lg:h-24 lg:px-0">
          <img
            className="w-8 h-8 rounded-full border-2 border-transparent hover:border-purple transition-all duration-200 cursor-pointer"
            src="/image-daniel.jpg"
            alt="User avatar"
          />
        </div>
      </div>
    </aside>
  );
};
