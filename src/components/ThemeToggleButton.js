'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export default function ThemeToggleButton({ isLightMode, setIsLightMode }) {
  return (
    <label className="relative inline-block w-14 h-7 cursor-pointer">
      <input
        type="checkbox"
        checked={isLightMode}
        onChange={() => setIsLightMode(!isLightMode)}
        className="sr-only peer"
      />
      <span
        className={clsx(
          "block w-full h-full rounded-full transition-colors duration-300",
          isLightMode ? "bg-[#D1D5DB]" : "bg-gray-700 peer-checked:bg-[#F0F0F0]"
        )}
      />
      <span
        className={clsx(
          "absolute top-0.5 left-0.5 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300",
          "peer-checked:translate-x-7",
          isLightMode ? "bg-[#FFB703]" : "bg-yellow-400"
        )}
      >
        <FontAwesomeIcon
          icon={isLightMode ? faSun : faMoon}
          className={clsx("text-xs", isLightMode ? "text-[#FB8500]" : "text-yellow-300")}
        />
      </span>
    </label>
  );
}

