import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select('-password'); // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        // Prevent updating sensitive fields
        delete updates.password;
        delete updates.email;
        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};