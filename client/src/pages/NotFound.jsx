import React from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Rocket01Icon, Compass01Icon, StarsIcon } from "@hugeicons/core-free-icons";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[var(--bg-main)] text-gray-900 dark:text-[var(--text-main)] overflow-hidden px-6">

      
      <HugeiconsIcon
        icon={Compass01Icon}
        size={100}
        className="absolute top-10 left-8 text-purple-500 opacity-10 animate-spin-slow"
      />
      
      <HugeiconsIcon
        icon={StarsIcon}
        size={100}
        className="absolute top-1/3 right-10 text-pink-500 opacity-10 animate-pulse-slow"
      />
      <HugeiconsIcon
        icon={Compass01Icon}
        size={100}
        className="absolute bottom-24 left-26 text-purple-500 opacity-10 animate-spin-slow-reverse"
      />
      <HugeiconsIcon
        icon={StarsIcon}
        size={100}
        className="absolute bottom-10 right-20 text-pink-500 opacity-10 animate-pulse-slow"
      />

      <div className="relative z-10 text-center max-w-md">
        <HugeiconsIcon
          icon={AlertCircleIcon}
          size={100}
          className="mx-auto mb-6 text-purple-400 drop-shadow-lg"
        />

        <h1 className="text-6xl font-extrabold mb-2">404</h1>
        <p className="text-2xl mb-4 font-medium">Page Not Found 🚀</p>
        <p className="mb-8 text-gray-600">
          Looks like you’ve ventured off the map. Let’s get you back home safely.
        </p>

        <button
          onClick={() => navigate("/")}
          className="relative inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <span>Back to Home</span>
          <HugeiconsIcon icon={Rocket01Icon} size={22} />
          <span className="absolute -right-3 -top-3 w-5 h-5 rounded-full border-2 border-white animate-ping opacity-50"></span>
        </button>
      </div>

      <footer className="absolute bottom-6 text-sm text-gray-400 z-10">
        Zentra © {new Date().getFullYear()} • Keep exploring ✨
      </footer>
    </div>
  );
}
