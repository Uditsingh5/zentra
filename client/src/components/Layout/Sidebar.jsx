import React from "react";
import { NavLink } from "react-router-dom";
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
    const { isLoggedIn } = useSelector((state) => state.user);
    const handleLog = () => {
        if (!isLoggedIn) {
            return navigate("/login");
        }
        localStorage.removeItem("token");
        dispatch(clearUser());
        navigate("/login", { replace: true });
    };
    return (
        <nav className="w-64 h-screen sticky top-0 bg-white dark:bg-[var(--bg-sidebar)] border-r border-[#efefef] dark:border-[var(--border-color)] flex-shrink-0 z-40">
            <div className="flex flex-col justify-between h-full">
                <div className="px-8 py-8">
                    <div className="text-4xl font-[Fira_Sans] font-bold tracking-tight text-black dark:text-[var(--text-main)]">
                        Zentra
                    </div>
                </div>
                <div className="flex-1 px-4">
                    <ul className="space-y-2">
                        {navItems.map(({ label, to, icon: Icon }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-5 py-3.5 rounded-xl text-[17px] font-medium transition-all duration-200 group ${isActive
                                            ? "bg-[#f5f5f5] dark:bg-[var(--bg-hover)] text-black dark:text-[var(--text-main)] translate-x-1"
                                            : "text-[#737373] dark:text-[var(--text-secondary)] hover:bg-[#fafafa] dark:hover:bg-[var(--bg-hover)] hover:text-black dark:hover:text-[var(--text-main)] hover:translate-x-1"
                                        }`
                                    }
                                >
                                    <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                        <HugeiconsIcon icon={Icon} size={24} variant="stroke" />
                                    </div>
                                    <span>{label}</span>
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleLog}
                                className={`cursor-pointer flex items-center gap-4 px-5 py-3.5 rounded-xl text-[17px] font-medium w-full transition-all duration-200 group text-[#737373] dark:text-[var(--text-secondary)] hover:bg-[#fafafa] dark:hover:bg-[var(--bg-hover)] hover:text-black dark:hover:text-[var(--text-main)]`}
                            >
                                <div className="w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                    <HugeiconsIcon
                                        icon={isLoggedIn ? LogoutSquare01Icon : LoginSquare01Icon}
                                        size={24}
                                    />
                                </div>
                                {isLoggedIn ? "Logout" : "Login"}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="w-full p-4">
                    <ThemeToggler />
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
