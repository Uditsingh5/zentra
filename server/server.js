// Imports

import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoute from "./routes/authRoutes.js"
import postRoute from "./routes/postRoutes.js"
import userRouter from "./routes/userRoutes.js"
import settingsRoute from "./routes/settingsRoutes.js"
import commentRoute from "./routes/commentRoutes.js"
import profileRoute from "./routes/profileRoutes.js"
import uploadRouter from "./routes/upload.js"
// import { errorHandler } from "./middlewares/errorHandler.js"
import cors from "cors"


// // Sockets Usage
import http from "http";
import { Server } from "socket.io";
import socketSetup from "./sockets/index.js"



//env config and database area

dotenv.config({ quiet: true });
connectDB();
const PORT = process.env.PORT || 3000;


//App Initialization
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));
// yhi pr sockets setup kar denge last me for real time updates. 
const server = http.createServer(app);

const io = new Server(server
)

// io Connection
socketSetup(io);



//Inbuild Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//Custom Routes
// app.use("/api/user", authRoute)
app.use("/api/auth",express.json(), authRoute)
app.use('/api/user',userRouter)
app.use("/api/settings", settingsRoute);

app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)

// Upload Route
app.use("/api/upload",uploadRouter);


//Default Routes

app.get("/", (req, res) => {
  res.send('<h1>Zentra ki taraf se Ram Ram🙏!!</h1>');
})
app.get("/:id", profileRoute);
app.get("/profile/:id", profileRoute);


// custom error handler -> use Global Error Handler only after all routes are able to throw customErrors to it
// app.use(errorHandler)

// Console Text Color
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const WHITE = "\x1b[37m";  

app.listen(PORT, () => { console.log(`${RESET}Server: ${GREEN}[✓]${RESET} ${WHITE}http://localhost:${PORT}${RESET}`) })