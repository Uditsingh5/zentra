import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, SignupUser } from "../../api/ApiService/authService.js";
import {useDispatch,useSelector} from "react-redux"
import { setUser, clearUser } from "../../slices/userSlice.js";

const LoginSignUp = () => {
  const dispatch=useDispatch();
  const user = useSelector((state)=>state.user);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50 flex items-center justify-center p-6 relative overflow-hidden">

      <motion.div
        layout
        className="relative p-10 w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/80"
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
              className=" text-4xl pb-2 text-center font-extrabold bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isSignupPage ? "SignUp" : "Login"}
            </motion.h2>
          )}
        </AnimatePresence>

        <p className="text-center text-gray-500 text-sm mb-8">
          {isSignupPage ? "Create your account to get started" : "Welcome back! Please login to continue"}
        </p>

        {errorMsg && (
          <motion.p
            className="text-red-500 text-sm text-center mb-5 p-3 bg-red-50 rounded-xl border border-red-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMsg}
          </motion.p>
        )}

    
        <motion.div className="w-full mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
            Email 
          </label>
          <input
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 
                     focus:outline-none focus:border-fuchsia-700 focus:ring-4 focus:ring-fuchsia-50
                     transition-all duration-200 text-base"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:border-fuchsia-700 focus:ring-4 focus:ring-fuchsia-50
                         transition-all duration-200 text-base"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="w-full mb-7">
          <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
            Password
          </label>
          <input
            type="password"
            value={pwd}
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 
                     focus:outline-none focus:border-fuchsia-700 focus:ring-4 focus:ring-fuchsia-50
                     transition-all duration-200 text-base"
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
          className="w-full py-4 bg-gradient-to-r from-purple-800 to-fuchsia-700 text-white text-base font-semibold rounded-xl 
                   hover:from-purple-900 hover:to-fuchsia-800 disabled:opacity-60 disabled:cursor-not-allowed
                   shadow-lg shadow-fuchsia-300/50 hover:shadow-xl hover:shadow-fuchsia-300/50
                   transition-all duration-200"
        >
          {loading ? "Please wait..." : "Continue"}
        </motion.button>

        <motion.p
          onClick={changeHandler}
          className="w-full text-center mt-6 cursor-pointer text-gray-600 hover:text-gray-500 transition-colors text-base"
        >
          {isSignupPage ? (
            <>
              Already have an account?{" "}
              <span className="font-semibold text-fuchsia-600 underline">Login</span>
            </>
          ) : (
            <>
              New here?{" "}
              <span className="font-semibold text-fuchsia-600 underline">Sign up</span>
            </>
          )}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginSignUp;