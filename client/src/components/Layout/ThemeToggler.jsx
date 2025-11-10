import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon,
        Moon02Icon,
        ComputerIcon } from "@hugeicons/core-free-icons";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../slices/themeSlice.js";

const ThemeButton = ({ name, value }) => {
    const state = useSelector(state => state.mode)
    const dispatch = useDispatch();
    const [mode, setMode] = useState(state);
    return (
        <button
            onClick={(value) => {
                setMode(value);
                dispatch(setTheme(value));
            }}
            className={`hover:bg-gray-300 px-1 py-3 flex items-center justify-center grow-0 basis-0 rounded-2xl transition-all duration-200 ${
                mode === value ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
        >
            <HugeiconsIcon icon={name} size={24} />
        </button>
    );
};
export default function ToggleButton() {
    return (
    <div className="grid grid-flow-col auto-cols-fr gap-1 border-1 p-2 rounded-2xl bg-gray-50">
      <ThemeButton name={Sun03Icon} value="light" />
      <ThemeButton name={Moon02Icon} value="dark" />
      {/* <ThemeButton name={ComputerIcon} value="system" /> */}
    </div>
    );
}
