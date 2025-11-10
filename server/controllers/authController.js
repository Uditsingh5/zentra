import User from "../models/User.js";

import bcrypt from "bcrypt";
import bcryptUtil from "../utils/bcryptUtil.js";
import genToken from "../services/auth.js";

import { customError } from "../utils/errorProvider.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({
                name: "ValidationError",
                message: "name, email and password are required",
            });
        }

        const normalizedEmail = String(email).toLowerCase();

        const existingByEmail = await User.findOne({ email: normalizedEmail });
        if (existingByEmail) {
            console.log(`[!] Signup blocked: email already exists (${normalizedEmail})`);
            // return res.status(400).json({
            //     name: "ValidationError",
            //     message: "Email already in use",
            // });
            throw customError("EMAIL_IN_USE");
        }

        const hashed = await bcryptUtil(password);
        const newUser = new User({
            name,
            email: normalizedEmail,
            password: hashed,
        });
        const saved = await newUser.save();
        console.log(`[+] Signed up: ${saved._id.toString()} (${saved.email})`);

        const token = genToken(saved._id);
        const { password: _pw, ...safeUser } = saved.toObject();

        return res.status(201).json({ message: "SignUp Done!", token,user:safeUser});
    } catch (err) {
        if (err?.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || "field";
            console.log(`[!] Duplicate key error on signup: ${field}`);
            // return res.status(400).json({
            //     name: "ValidationError",
            //     message: `${field} already in use`,
            // });
            

            errorHandler(customError("EMAIL_IN_USE"), req, res);
        }
        console.error("[x] Signup error:", err);
        // return res.status(500).json({ message: "Internal Server Error!" });
        errorHandler(err, req, res);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.email || !user.password) {
            // console.log(`[!] Login failed: user not found for ${email}`);
            throw customError("USER_NOT_FOUND");
            // return res.status(400).json({
            //     name: "ValidationError",
            //     message: "Invalid Username or Password!",
            // });
        }
        const matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) {

            // console.log(`[!] Login failed: bad password for ${email}`);
            // return res.status(400).json({
            //     name: "ValidationError",
            //     message: "Invalid Username or Password!",
            // });

            throw customError("INVALID_CREDENTIALS");
        }
        const token = genToken(user._id);
        console.log(`[✓] Logged in: ${user._id.toString()} (${user.email})`);
        return res.status(200).json({ token ,  user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
            },});
    } catch (err) {
        errorHandler(err, req, res);
        // console.error("[x] Login error:", err);
        // return res.status(500).json({ message: "Internal Server Error!" });
    }
};
