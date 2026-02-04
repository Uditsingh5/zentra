import { React, useEffect, useRef } from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import { Toaster, toast } from 'react-hot-toast';

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
import { setUser, clearUser } from "./slices/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { initSocket, disconnectSocket, getSocket } from "./services/socket.js";

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);
console.log("SOCKET URL:", import.meta.env.VITE_SOCKET_URL);

const App = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.user);
    const shownNotificationIds = useRef(new Set());
    // console.log("Current Theme Mode:", theme);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, user not logged in.");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await API.get("/user/me");
                console.log("Fetched user data:", res.data);
                const userData = {
                    userId: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    avatar: res.data.avatar,
                };

                // Initialize socket connection FIRST
                if (userData.userId) {
                    console.log('🔌 Initializing socket for user:', userData.userId);
                    initSocket(userData.userId);
                }

                // Then set user data
                dispatch(setUser(userData));

            } catch (err) {
                console.error(
                    "Error fetching user:",
                    err.response?.data || err.message
                );
                dispatch(clearUser());
                disconnectSocket();
            }
        };

        fetchUser();

        return () => {
            disconnectSocket();
        };
    }, [dispatch]);

    // Real-time notification system
    useEffect(() => {
        if (!userInfo?.userId) {
            console.log('⚠️ No user ID, skipping notification setup');
            return;
        }

        console.log('🔄 Setting up notification system for user:', userInfo.userId);

        const socket = getSocket();
        if (!socket) {
            console.log('❌ No socket instance available');
            return;
        }

        let isSetupComplete = false;

        const setupNotifications = () => {
            if (isSetupComplete) return;
            isSetupComplete = true;

            console.log('🚀 Setting up notification listeners - socket connected');

            // Test socket connectivity
            socket.emit('ping', { userId: userInfo.userId, timestamp: Date.now() });

            const handleNotification = (notificationData) => {
                console.log('🔔 ===== NOTIFICATION RECEIVED =====');
                console.log('🔔 Raw data:', notificationData);
                console.log('🔔 Type:', notificationData?.type, 'ID:', notificationData?._id);

                try {
                    if (!notificationData || !notificationData._id) {
                        console.error('❌ Invalid notification data');
                        return;
                    }

                    // Prevent duplicate notifications
                    if (shownNotificationIds.current.has(notificationData._id)) {
                        console.log('🔄 Duplicate notification blocked:', notificationData._id);
                        return;
                    }

                    shownNotificationIds.current.add(notificationData._id);
                    console.log('✅ Processing notification, added to shown set');

                    const senderName = notificationData.senderName || 'Someone';
                    console.log('👤 Sender name:', senderName);

                    const messages = {
                        like: [
                            `${senderName} loved your post! ❤️`,
                            `Your post got a heart from ${senderName}! 💖`,
                            `New like from ${senderName}! 👍`,
                            `${senderName} appreciates your content! 🌟`
                        ],
                        comment: [
                            `${senderName} commented on your post! 💬`,
                            `New comment from ${senderName}! 📝`,
                            `${senderName} joined the conversation! 🗣️`,
                            `${senderName} shared their thoughts! 💭`
                        ],
                        reply: [
                            `${senderName} replied to your comment! 💭`,
                            `${senderName} responded to you! ↩️`,
                            `Reply from ${senderName}! 💬`,
                            `${senderName} continued the discussion! 🔄`
                        ],
                        follow: [
                            `${senderName} started following you! 🎉`,
                            `${senderName} joined your community! 👋`,
                            `New follower: ${senderName}! ⭐`,
                            `${senderName} is now following you! 📈`
                        ],
                        mention: [
                            `${senderName} mentioned you! 📣`,
                            `${senderName} tagged you! 🏷️`,
                            `${senderName} put you in the spotlight! 🌟`,
                            `${senderName} mentioned you in a post! 📢`
                        ]
                    };

                    const typeMessages = messages[notificationData.type] || [`New ${notificationData.type} notification from ${senderName}`];
                    const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];
                    console.log('📝 Selected message:', message);

                    let icon = '🔔';
                    switch (notificationData.type) {
                        case 'like': icon = '❤️'; break;
                        case 'comment': icon = '💬'; break;
                        case 'reply': icon = '💭'; break;
                        case 'follow': icon = '👥'; break;
                        case 'mention': icon = '📣'; break;
                    }

                    console.log('🎯 About to show toast with icon:', icon);

                    toast.success(message, {
                        duration: 4000,
                        icon: icon,
                        style: {
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                        },
                        ariaProps: {
                            role: 'status',
                            'aria-live': 'polite',
                        },
                    });

                    console.log('✅ Toast notification displayed successfully!');

                } catch (error) {
                    console.error('❌ Error handling notification:', error);
                }
            };

            const handlePong = (data) => {
                console.log('🏓 Pong received from server:', data);
            };

            socket.on('notify', handleNotification);
            socket.on('pong', handlePong);

            console.log('👂 Notification listeners attached');
        };

        // If socket is already connected, set up immediately
        if (socket.connected) {
            console.log('🔗 Socket already connected, setting up immediately');
            setupNotifications();
        } else {
            console.log('⏳ Socket not connected yet, waiting for connection event');

            const handleConnect = () => {
                console.log('🔗 Socket connected event received');
                setupNotifications();
            };

            socket.on('connect', handleConnect);

            // Clean up the connect listener when this effect re-runs
            return () => {
                socket.off('connect', handleConnect);
            };
        }

        // Cleanup function for notification listeners
        return () => {
            if (isSetupComplete) {
                console.log('🧹 Cleaning up notification listeners');
                socket.off('notify');
                socket.off('pong');
            }
        };

    }, [userInfo?.userId]);

    // Clear shown notifications when user logs out
    useEffect(() => {
        if (!userInfo?.userId) {
            shownNotificationIds.current.clear();
        }
    }, [userInfo?.userId]);

    // Theme is now handled by ThemeToggler component

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: 'var(--bg-main)',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: 'var(--bg-main)',
                        },
                    },
                }}
            />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/notification" element={<Notifications />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route path="/logout" element={<NotFound />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            
        </>
    );
};

export default App;
