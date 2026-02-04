import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import postRoute from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";
import settingsRoute from "./routes/settingsRoutes.js";
import commentRoute from "./routes/commentRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import uploadRouter from "./routes/upload.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import socketSetup from "./sockets/index.js";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const allowedOrigins = isProduction
  ? (CLIENT_ORIGIN ? [CLIENT_ORIGIN] : ["https://zentra-f3ep52odb-codewithudit01-2386s-projects.vercel.app"])
  : [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(null, false);
  },
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

socketSetup(io);
app.set("io", io);

app.use("/api/auth", express.json(), authRoute);
app.use("/api/user", userRouter);
app.use("/api/settings", settingsRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRouter);

app.get("/", (req, res) => {
  res.send("<h1>Zentra API</h1>");
});

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

connectDB()
  .then(() => startServer(PORT))
  .catch(() => process.exit(1));
