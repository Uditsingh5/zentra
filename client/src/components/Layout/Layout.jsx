import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar.jsx";

const Layout = () => {
    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-300">
                <main className="flex-1 overflow-y-auto bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
