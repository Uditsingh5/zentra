import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginSignUp from "../components/Forms/LoginSignUp";

const Login = () => {
  const isLogin = useSelector((state) => state.user.isLoggedIn);
  const [redirectAllowed, setRedirectAllowed] = useState(true);

  // Disable redirect if logout is in progress
  useEffect(() => {
    if (!isLogin) {
      setRedirectAllowed(false); // user just logged out, block redirect briefly
      const timer = setTimeout(() => setRedirectAllowed(true), 100); // 100ms buffer
      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  if (isLogin && redirectAllowed) {
    return <Navigate to="/" replace />;
  }

  return <LoginSignUp />;
};

export default Login;
