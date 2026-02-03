import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { createNotification } from '../sockets/NotificationUtil.js';

/**
 * Create a new comment or reply
 * @route POST /comments
 */
export const postComment = async (req, res) => {
    try {
        const authorId = req.user._id; // Get from auth middleware
        const { postId, content, parentCommentId } = req.body;

        // Validate post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "Invalid postId" });
        }

        // Create comment
        const newComment = new Comment({
            postId,
            authorId,
            content,
            parentCommentId: parentCommentId || null
        });

        const savedComment = await newComment.save();

        // Only push top-level comments to post
        if (!parentCommentId) {
            post.comments.push(savedComment._id);
            await post.save();
        }

        // Create Notification for Comment Author or Post Author
        let receiverId = null;

        if (parentCommentId) {
            // This is a reply to a comment - notify the comment author
            const parentComment = await Comment.findById(parentCommentId);
            if (parentComment && parentComment.authorId.toString() !== authorId.toString()) {
                receiverId = parentComment.authorId.toString();
            }
        } else {
            // This is a top-level comment - notify the post author
            if (post.authorId.toString() !== authorId.toString()) {
                receiverId = post.authorId.toString();
            }
        }

        if (receiverId) {
            const io = req.app.get('io');
            // Use different notification types for comments vs replies
            const notificationType = parentCommentId ? 'reply' : 'comment';

            await createNotification({
                io,
                type: notificationType,
                receiverId: receiverId,
                senderId: authorId.toString(),
                postId: post._id.toString()
            });
        }

        // Populate author data before returning
        const populatedComment = await Comment.findById(savedComment._id)
            .populate({
                path: 'authorId',
                select: 'name username avatar',
                model: 'user'
            })
            .lean();

        return res.status(201).json({
            message: "Comment created successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Get top-level comments for a post
 * @route GET /posts/:id/comments
 */
export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ postId, parentCommentId: null })
            .populate({
                path: 'authorId',
                select: 'name username avatar',
                model: 'user'
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Get paginated replies for a comment
 * @route GET /comments/:id/replies?page=1
 */
export const getReplies = async (req, res) => {
    try {
        const parentCommentId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const replies = await Comment.find({ parentCommentId })
            .populate({
                path: 'authorId',
                select: 'name username avatar',
                model: 'user'
            })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalReplies = await Comment.countDocuments({ parentCommentId });

        return res.status(200).json({
            message: "Replies fetched successfully",
            replies,
            totalReplies,
            currentPage: page,
            totalPages: Math.ceil(totalReplies / limit)
        });
    } catch (error) {
        console.error("Error fetching replies:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Delete a comment
 * @route DELETE /comments/:id
 */
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user owns the comment
        if (comment.authorId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        // If it's a top-level comment, remove it from post
        if (!comment.parentCommentId) {
            await Post.findByIdAndUpdate(comment.postId, {
                $pull: { comments: commentId }
            });
        }

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};