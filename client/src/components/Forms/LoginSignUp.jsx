import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars -- motion used in JSX (motion.div, etc.)
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, SignupUser } from "../../api/ApiService/authService.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice.js";

const LoginSignUp = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignupPage = location.pathname === "/signup";

  const [hasLoaded, setHasLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 1);
    return () => clearTimeout(timer);
  }, []);

  const changeHandler = () => {
    if (isSignupPage) navigate("/login");
    else navigate("/signup");

    setName("");
    setEmail("");
    setPwd("");
    setErrorMsg("");
  };

  const submitHandler = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignupPage) {
        const data = await SignupUser({ name, email, password: pwd });
        console.log("Signup Success:", data);
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        navigate("/");
      } else {
        const data = await loginUser({ email, password: pwd });
        console.log("Login Success:", data);
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        navigate("/");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] flex items-center justify-center p-6 relative overflow-hidden">

      <motion.div
        layout
        className="relative p-10 w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          layout: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.5 },
          y: { duration: 0.5 }
        }}
      >
        <AnimatePresence mode="wait">
          {hasLoaded && (
            <motion.h2
              key={isSignupPage ? "SignUp" : "Login"}
              layout="position"
              className="text-4xl pb-2 text-center font-extrabold text-[var(--text-main)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isSignupPage ? "SignUp" : "Login"}
            </motion.h2>
          )}
        </AnimatePresence>

        <p className="text-center text-[var(--text-secondary)] text-sm mb-8">
          {isSignupPage ? "Create your account to get started" : "Welcome back! Please login to continue"}
        </p>

        {errorMsg && (
          <motion.p
            className="text-red-500 text-sm text-center mb-5 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMsg}
          </motion.p>
        )}

    
        <motion.div className="w-full mb-5">
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1 ml-1">
            Email 
          </label>
          <input
            className="w-full px-4 py-3.5 border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-hover)] focus:ring-2 focus:ring-[var(--border-hover)]/20 transition-all duration-200 text-base bg-[var(--bg-main)]"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {isSignupPage && (
            <motion.div
              key="name-field"
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 20 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              style={{ overflow: "hidden" }}
            >
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-1 ml-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-hover)] focus:ring-2 focus:ring-[var(--border-hover)]/20 transition-all duration-200 text-base bg-[var(--bg-main)]"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="w-full mb-7">
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1 ml-1">
            Password
          </label>
          <input
            type="password"
            value={pwd}
            className="w-full px-4 py-3.5 border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-hover)] focus:ring-2 focus:ring-[var(--border-hover)]/20 transition-all duration-200 text-base bg-[var(--bg-main)]"
            placeholder="Enter your password"
            onChange={(e) => setPwd(e.target.value)}
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={submitHandler}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] text-base font-semibold rounded-xl hover:bg-[#030303] dark:hover:bg-[var(--bg-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          {loading ? "Please wait..." : "Continue"}
        </motion.button>

        <motion.p
          onClick={changeHandler}
          className="w-full text-center mt-6 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors text-base"
        >
          {isSignupPage ? (
            <>
              Already have an account?{" "}
              <span className="font-semibold text-[var(--text-main)] underline">Login</span>
            </>
          ) : (
            <>
              New here?{" "}
              <span className="font-semibold text-[var(--text-main)] underline">Sign up</span>
            </>
          )}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginSignUp;