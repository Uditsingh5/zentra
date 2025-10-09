import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

/**
 * Creates a new comment for a post.
 * @param {import('express').Request} req - The request object containing postId, authorId, and content in the body.
 * @param {import('express').Response} res - The response object used to send the result.
 * @returns {Promise<void>} Sends a JSON response with the result of the comment creation.
 */
export const postComment = async (req, res) => {
    try {
        const { postId, authorId, content } = req.body;
        const user = await User.findById(authorId);
        const post = await Post.findById(postId);
        if(!user || !post) {
            return res.status(400).json({ message: "Invalid authorId or postId" });
        }
        const newComment = new Comment({
            postId,
            authorId,
            content,
        });
        const savedComment = await newComment.save();
        post.comments.push(savedComment._id);
        await post.save();
        return res.status(201).json({ message: "Comment created successfully", comment: savedComment });
    }
    catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ postId }).populate('authorId', 'name', 'username').sort({ createdAt: -1 });
        return res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};