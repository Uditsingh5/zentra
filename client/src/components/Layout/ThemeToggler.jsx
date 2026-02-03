import React, { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon,
        Moon02Icon } from "@hugeicons/core-free-icons";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../slices/themeSlice.js";

// Initialize theme immediately on module load
const initializeAppTheme = () => {
    try {
        const savedTheme = localStorage.getItem("zentra-theme");

        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
            // Apply saved theme immediately
            const root = document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(savedTheme);
            return savedTheme;
        } else {
            // Use system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const systemTheme = prefersDark ? "dark" : "light";

            // Apply immediately
            const root = document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);

            // Save to localStorage
            localStorage.setItem("zentra-theme", systemTheme);
            return systemTheme;
        }
    } catch {
        // Fallback
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const systemTheme = prefersDark ? "dark" : "light";
        document.documentElement.classList.add(systemTheme);
        return systemTheme;
    }
};

// Initialize theme before component renders
const initialTheme = initializeAppTheme();

const ThemeButton = ({ name, value }) => {
    const { mode } = useSelector(state => state.theme);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(setTheme(value));
    };

    return (
        <button
            onClick={handleClick}
            className={`px-1 py-3 flex items-center justify-center grow-0 basis-0 rounded-2xl transition-all duration-200 ${
                mode === value
                    ? "bg-gray-800 hover:bg-black text-white shadow-md dark:bg-[#262626] dark:hover:bg-black"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-[var(--bg-card)] dark:text-[var(--text-secondary)] dark:hover:bg-[var(--bg-hover)]"
            }`}
        >
            <HugeiconsIcon icon={name} size={20} />
        </button>
    );
};

export default function ToggleButton() {
    const { mode } = useSelector(state => state.theme);
    const dispatch = useDispatch();

    // Sync Redux state with DOM theme (theme already applied on module load)
    useEffect(() => {
        dispatch(setTheme(initialTheme));
        console.log('Theme initialized:', initialTheme);
    }, [dispatch]);

    // Apply theme changes to DOM and save to localStorage
    useEffect(() => {
        const root = document.documentElement;

        // Remove all theme classes first
        root.classList.remove("light", "dark");

        // Add the current theme class
        root.classList.add(mode);

        // Save to localStorage
        try {
            localStorage.setItem("zentra-theme", mode);
        } catch (err) {
            console.warn("Failed to save theme to localStorage:", err);
        }
    }, [mode]);

    return (
        <div className="grid grid-flow-col auto-cols-fr gap-1 border border-[var(--border-color)] p-2 rounded-2xl bg-[var(--bg-card)]">
            <ThemeButton name={Sun03Icon} value="light" />
            <ThemeButton name={Moon02Icon} value="dark" />
        </div>
    );
}
