import {React ,useEffect} from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";

import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import SearchPage from "./pages/SearchPage.jsx";

import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
// import Logout from "./pages/Logout.jsx";
import NotFound from "./pages/NotFound.jsx";


// Initial Fetch
import API from "./api/axios.js";
import { setUser,clearUser } from "./slices/userSlice.js";
import { useDispatch, useSelector } from "react-redux";


const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    // const theme = useSelector((state) => state.theme.mode);
    // console.log("Current Theme Mode:", theme);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, user not logged in.");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await API.get("/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Fetched user data:", res.data);
                dispatch(
                    setUser({
                        userId: res.data._id,
                        name: res.data.name,
                        email: res.data.email,
                        avatar: res.data.avatar,
                    })
                );
            } catch (err) {
                console.error(
                    "Error fetching user:",
                    err.response?.data || err.message
                );
                dispatch(clearUser());
            }
        };

        fetchUser();
    }, [dispatch]);
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notification" element={<Notifications />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile/:id/comments" element={<Profile />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/logout" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
