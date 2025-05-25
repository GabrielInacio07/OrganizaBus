'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export default function ThemeToggleButton({ isLightMode, setIsLightMode }) {
  return (
    <div className="absolute top-5 right-5 z-10 animate-fadeIn">
      <label className="relative inline-block w-14 h-7 cursor-pointer">
        <input
          type="checkbox"
          checked={isLightMode}
          onChange={() => setIsLightMode(!isLightMode)}
          className="sr-only peer"
        />
        <span className="block w-full h-full bg-gray-600 rounded-full peer-checked:bg-gray-300 transition-colors" />
        <span
          className={clsx(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full flex items-center justify-center transition-all",
            "peer-checked:translate-x-7 bg-yellow-400"
          )}
        >
          <FontAwesomeIcon icon={isLightMode ? faSun : faMoon} className="text-yellow-700 text-xs" />
        </span>
      </label>
    </div>
  );
}
