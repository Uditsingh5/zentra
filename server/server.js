// Imports

import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoute from "./routes/authRoutes.js"
import postRoute from "./routes/postRoutes.js"
import userRouter from "./routes/userRoutes.js"
import commentRoute from "./routes/commentRoutes.js"


//env config and database area

dotenv.config({ quiet: true });
connectDB();
const PORT = process.env.PORT || 3000;


//App Initialization
const app = express();

// yhi pr sockets setup kar denge last me for real time updates. 




//Inbuild Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



//Custom Routes

// app.use("/api/user", authRoute)
app.use("/api/auth",express.json(), authRoute)
app.use('/api/user',userRouter)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)



//Default Routes

app.get("/", (req, res) => {
  res.send('<h1>Zentra ki taraf se Ram Ram🙏!!</h1>');
})



// Console Text Color
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const WHITE = "\x1b[37m";  

app.listen(PORT, () => { console.log(`${RESET}Server: ${GREEN}[✓]${RESET} ${WHITE}http://localhost:${PORT}${RESET}`) })