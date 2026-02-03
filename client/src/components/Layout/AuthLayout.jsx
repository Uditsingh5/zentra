import React from 'react'
import {Navigate, Outlet} from "react-router-dom";

const AuthLayout = () => {
    const isAuth = localStorage.getItem("token") !== null;
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[var(--bg-main)] text-black dark:text-[var(--text-main)]">
            <Outlet />
        </div>
    )
}
export default AuthLayout
