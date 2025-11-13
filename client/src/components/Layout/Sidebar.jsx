import React, { use } from "react";
import { NavLink, redirect } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Home03Icon,
    Search01Icon,
    Notification01Icon,
    User03Icon,
    Add01Icon,
    Settings01Icon,
    LogoutSquare01Icon,
    LoginSquare01Icon,
    UserMultiple02Icon,
} from "@hugeicons/core-free-icons";

import ThemeToggler from "./ThemeToggler.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../slices/userSlice.js";

const navItems = [
    { label: "Home", to: "/", icon: Home03Icon },
    { label: "Search", to: "/search", icon: Search01Icon },
    { label: "Profile", to: "/profile", icon: User03Icon },
    { label: "Notification", to: "/notification", icon: Notification01Icon },
    { label: "Settings", to: "/settings", icon: Settings01Icon },
    // { label: "Collab", to: "/collab", icon: UserMultiple02Icon },
    // { label: "Login", to: "/login", icon: LoginSquare01Icon },
    // { label: "Logout", to: "/logout", icon: LogoutSquare01Icon },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);
    const handleLog = () => {
        if (!isLoggedIn) {
            return navigate("/login");
        }
        localStorage.removeItem("token");
        dispatch(clearUser());
        navigate("/login", { replace: true });
    };
    return (
        <nav className="w-64 h-full bg-white border-r-2 border-gray-200">
            <div className="flex flex-col justify-between h-full">
                <div className="px-6 py-6">
                    <div className="text-4xl text-gray-800 -tracking-normal font-[Fira_Sans] font-semibold">
                        Zentra
                    </div>
                </div>
                <div className="flex-1 px-3">
                    <ul className="space-y-2">
                        {navItems.map(({ label, to, icon: Icon }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-medium relative no-underline transition-all duration-200 ${
                                            isActive
                                                ? "text-black font-semibold"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                        }`
                                    }
                                    style={({ isActive }) =>
                                        isActive
                                            ? { backgroundColor: "#CE97FF" }
                                            : {}
                                    }
                                >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <HugeiconsIcon icon={Icon} size={24} />
                                    </div>
                                    <span className="font-medium">{label}</span>
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleLog}
                                className={`cursor-pointer flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-medium w-full text-gray-800 hover:bg-gray-200 ${isLoggedIn &&"text-red-700 hover:bg-red-200 hover:text-red-700"}`}>
                                <HugeiconsIcon
                                    icon={LogoutSquare01Icon}
                                    size={24}
                                />{" "}
                                {isLoggedIn ? "Logout" : "Login"}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="w-full p-2 ">
                    <ThemeToggler />
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
