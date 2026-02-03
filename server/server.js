// Imports
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoute from "./routes/authRoutes.js"
import postRoute from "./routes/postRoutes.js"
import userRouter from "./routes/userRoutes.js"
import settingsRoute from "./routes/settingsRoutes.js"
import commentRoute from "./routes/commentRoutes.js"
import profileRoute from "./routes/profileRoutes.js"
import uploadRouter from "./routes/upload.js"
import notificationRoutes from "./routes/notificationRoutes.js" // Add notification routes
// import { errorHandler } from "./middlewares/errorHandler.js"
import cors from "cors"


// // Sockets Usage
import http from "http";
import { Server } from "socket.io";
import socketSetup from "./sockets/index.js"



// env config and database area
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// App Initialization
const app = express();

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"]
  }
})

// io Connection
socketSetup(io);

// Make io instance globally available for controllers
app.set('io', io);



//Inbuild Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//Custom Routes
// app.use("/api/user", authRoute)
app.use("/api/auth", express.json(), authRoute)
app.use('/api/user', userRouter)
app.use("/api/settings", settingsRoute);

app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)
app.use("/api/notifications", notificationRoutes) // Add notification routes

// Upload Route
app.use("/api/upload", uploadRouter);


// Serve client static build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (isProduction) {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/socket")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send('<h1>Zentra ki taraf se Ram Ram🙏!!</h1>');
  });
}


// custom error handler -> use Global Error Handler only after all routes are able to throw customErrors to it
// app.use(errorHandler)


// Console Text Color
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const WHITE = "\x1b[37m";
const RED = "\x1b[31m";

// Start server only after DB is connected
const startServer = (port) => {
  server.listen(port, () => {
    console.log(`${RESET}Server: ${GREEN}[✓]${RESET} ${WHITE}http://localhost:${port}${RESET}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`${RED}Port ${port} is busy, trying ${port + 1}...${RESET}`);
      startServer(port + 1);
    } else {
      console.error(`${RED}Server error:${RESET}`, err);
      process.exit(1);
    }
  });
};

connectDB()
  .then(() => startServer(PORT))
  .catch(() => process.exit(1));