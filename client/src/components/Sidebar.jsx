import React from "react";
import { NavLink } from "react-router-dom";
import { HugeiconsIcon } from '@hugeicons/react';
import { Home03Icon, Search01Icon, Notification01Icon, User03Icon, Add01Icon, Settings01Icon, LogoutSquare01Icon, UserMultiple02Icon } from '@hugeicons/core-free-icons';

const navItems = [
  { label: "Home", to: "/", icon: Home03Icon },
  { label: "Search", to: "/search", icon: Search01Icon },
  { label: "Profile", to: "/profile", icon: User03Icon },
  { label: "Notification", to: "/notification", icon: Notification01Icon },
  // { label: "Collab", to: "/collab", icon: UserMultiple02Icon },
  { label: "Settings", to: "/settings", icon: Settings01Icon },
  { label: "Logout", to: "/logout", icon: LogoutSquare01Icon },
];

const Sidebar = () => {
  return (
    <nav className="w-64 h-full bg-white border-r-2 border-gray-200">
      <div className="flex flex-col h-full">
  
        <div className="px-6 py-6">
          <div className="text-4xl text-gray-800 -tracking-normal font-[Fira_Sans] font-semibold" >Zentra</div>
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
                    }`}
                  style={({ isActive }) => isActive ? { backgroundColor: '#CE97FF' } : {}}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <HugeiconsIcon 
                      icon={Icon} 
                      size={24} 
                    />
                  </div>
                  <span className="font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

      
        
      </div>
    </nav>
  );
};

export default Sidebar;