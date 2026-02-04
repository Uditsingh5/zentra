import Post from '../models/Post.js';
import User from '../models/User.js';
import Report from '../models/Report.js';
import mongoose from 'mongoose';
import { createNotification } from '../sockets/NotificationUtil.js';
import cloudinary from '../config/cloudinary.js';

// Get posts by a specific user
export const postGet = async (req, res) => {
      try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(400).json({ message: 'Invalid User ID' });
            }
            const posts = await Post.find({ authorId: id })
                  .populate('authorId', 'name username avatar')
                  .sort({ createdAt: -1 });
            
            // Transform posts to match frontend expectations
            const transformedPosts = posts.map(post => ({
                  _id: post._id,
                  content: post.content,
                  image: post.image,
                  images: post.attachments && post.attachments.length > 0 ? post.attachments : (post.image ? [post.image] : []),
                  attachments: post.attachments || [],
                  feeling: post.feeling || null,
                  likes: post.likes || [],
                  comments: post.comments || [],
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  author: {
                        _id: post.authorId._id,
                        name: post.authorId.name,
                        username: post.authorId.username,
                        avatar: post.authorId.avatar
                  }
            }));
            
            return res.status(200).json({ message: 'All Posts Fetched!!', posts: transformedPosts });
      } catch (error) {
            console.error('Error fetching user posts:', error);
            return res.status(500).json({ message: 'Failed to Fetch All Posts' });
      }
};

// Get posts with author info, sorted by latest first
export const getPosts = async (req, res) => {
      try {
            const limit = parseInt(req.query.limit) || 10;
            const skip = parseInt(req.query.skip) || 0;
            console.log(`📡 getPosts called - limit: ${limit}, skip: ${skip}`);


            // Get total count first
            const totalPosts = await Post.countDocuments();

            // For random ordering with proper pagination, we'll use a seeded shuffle
            // This ensures consistency across requests while maintaining randomness
            let allPosts = await Post.find()
                  .populate('authorId', 'name username avatar')
                  .lean();


            // Create a seeded shuffle for consistent randomization
            // Use a simple seed based on the current date to ensure consistency within a day
            const today = new Date().toDateString();
            const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

            function seededRandom(seed) {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            }

            // Shuffle posts using seeded random for consistency
            const shuffledPosts = [...allPosts];
            for (let i = shuffledPosts.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom(seed + i) * (i + 1));
                [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]];
            }


            // Apply pagination after shuffling and ensure uniqueness
            let posts = [];
            let currentIndex = skip;

            // Collect unique posts for this page
            while (posts.length < limit && currentIndex < shuffledPosts.length) {
                const candidatePost = shuffledPosts[currentIndex];
                const postId = candidatePost._id.toString();

                // Ensure this post isn't already in our current page
                if (!posts.some(p => p._id.toString() === postId)) {
                    posts.push(candidatePost);
                }
                currentIndex++;
            }


            // Double-check for duplicates (should not happen with our logic)
            const postIds = posts.map(p => p._id.toString());
            const uniqueIds = new Set(postIds);
            if (postIds.length !== uniqueIds.size) {
                // Remove duplicates as fallback
                const seen = new Set();
                posts = posts.filter(post => {
                    const id = post._id.toString();
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
            }

            const hasMorePosts = skip + limit < totalPosts && posts.length === limit;

            // Transform posts to match frontend expectations
            const transformedPosts = posts.map(post => ({
                  _id: post._id,
                  content: post.content,
                  image: post.image,
                  images: post.attachments && post.attachments.length > 0 ? post.attachments : (post.image ? [post.image] : []),
                  attachments: post.attachments || [],
                  feeling: post.feeling || null,
                  likes: post.likes || [],
                  comments: post.comments || [],
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  author: {
                        _id: post.authorId._id,
                        name: post.authorId.name,
                        username: post.authorId.username,
                        avatar: post.authorId.avatar
                  }
            }));
            
            return res.status(200).json({
                  message: 'Posts fetched successfully',
                  posts: transformedPosts,
                  hasMore: hasMorePosts
            });
      } catch (error) {
            console.error('🔴 Error fetching posts:', error.message);
            console.error('Stack:', error.stack);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
};

// Create a new post
export const postCreate = async (req, res) => {
      try {
            const authorId = req.user._id;
            const { content, images, feeling } = req.body;
            if (!content) {
                  return res.status(400).json({ message: 'content is required' });
            }
            const newPost = new Post({
                  authorId,
                  content,
                  image: images && images.length > 0 ? images[0] : null,
                  attachments: images && images.length > 0 ? images : [],
                  feeling: feeling || null
            });
            await newPost.save();
            return res.status(201).json({ message: 'Post created successfully!', post: newPost });
      } catch (error) {
            console.error('Post creation error:', error);
            return res.status(500).json({ message: 'Internal Server Error!' });
      }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
      if (!url) return null;
      // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
      const match = url.match(/\/upload\/(.+)\.[a-zA-Z]+$/);
      return match ? match[1] : null;
};

// Delete a post
export const postDelete = async (req, res) => {
      try {
            const postId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                  return res.status(400).json({ message: 'Invalid Post ID' });
            }

            // Find the post first to get image URLs before deleting
            const post = await Post.findById(postId);
            if (!post) {
                  return res.status(404).json({ message: 'Post Not Found!' });
            }

            // Delete images from Cloudinary
            const imagesToDelete = [];
            if (post.image) imagesToDelete.push(post.image);
            if (post.attachments && post.attachments.length > 0) {
                  imagesToDelete.push(...post.attachments);
            }

            // Remove duplicates
            const uniqueImages = [...new Set(imagesToDelete)];

            // Delete each image from Cloudinary
            for (const imageUrl of uniqueImages) {
                  const publicId = extractPublicId(imageUrl);
                  if (publicId) {
                        try {
                              console.log('Deleting image from Cloudinary:', publicId);
                              await cloudinary.uploader.destroy(publicId);
                              console.log('Successfully deleted image:', publicId);
                        } catch (cloudinaryError) {
                              console.error('Error deleting image from Cloudinary:', publicId, cloudinaryError);
                              // Continue with post deletion even if image deletion fails
                        }
                  }
            }

            // Delete the post from database
            await Post.findByIdAndDelete(postId);

            return res.status(200).json({ message: 'Post deleted successfully!!' });
      } catch (error) {
            console.error('Error deleting post:', error);
            return res.status(500).json({ message: 'Internal Server Error!' });
      }
};

// Like a post
export const likePost = async (req, res) => {
      try {
            const postId = req.params.id;
            const userId = req.user._id;
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.likes.includes(userId)) {
                  return res.status(400).json({ message: 'Post already liked' });
            }
            post.likes.push(userId);
            await post.save();
            if (post.authorId.toString() !== userId.toString()) {
                  const io = req.app.get('io');
                  await createNotification({
                        io,
                        type: 'like',
                        receiverId: post.authorId.toString(), // Convert ObjectId to string
                        senderId: userId.toString(), // Ensure senderId is also string
                        postId: post._id.toString()
                  });
            }
            return res.status(200).json({ message: 'Post liked', likes: post.likes });
      } catch (error) {
            console.error('Error liking post:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
      }
};

// Unlike a post
export const unlikePost = async (req, res) => {
      try {
            const postId = req.params.id;
            const userId = req.user._id;
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (!post.likes.includes(userId)) {
                  return res.status(400).json({ message: 'Post not liked yet' });
            }
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            await post.save();
            return res.status(200).json({ message: 'Post unliked', likes: post.likes });
      } catch (error) {
            console.error('Error unliking post:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
      }
};

// Save a post to user's savedPosts
export const savePost = async (req, res) => {
      try {
            const postId = req.params.id;
            const userId = req.user._id;
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                  return res.status(400).json({ message: 'Invalid Post ID' });
            }
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            if (user.savedPosts.includes(postId)) {
                  return res.status(400).json({ message: 'Post already saved' });
            }
            user.savedPosts.push(postId);
            await user.save();
            return res.status(200).json({ message: 'Post saved', savedPosts: user.savedPosts });
      } catch (error) {
            console.error('Error saving post:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
      }
};

// Unsave a post
export const unsavePost = async (req, res) => {
      try {
            const postId = req.params.id;
            const userId = req.user._id;
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                  return res.status(400).json({ message: 'Invalid Post ID' });
            }
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
            await user.save();
            return res.status(200).json({ message: 'Post unsaved', savedPosts: user.savedPosts });
      } catch (error) {
            console.error('Error unsaving post:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
      }
};

// Report a post
export const reportPost = async (req, res) => {
      try {
            const postId = req.params.id;
            const reporterId = req.user._id;
            const { reason, description } = req.body;

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                  return res.status(400).json({ message: 'Invalid Post ID' });
            }

            // Check if post exists
            const post = await Post.findById(postId);
            if (!post) {
                  return res.status(404).json({ message: 'Post not found' });
            }

            // Check if user already reported this post
            const existingReport = await Report.findOne({
                  postId,
                  reporterId
            });

            if (existingReport) {
                  return res.status(400).json({ message: 'You have already reported this post' });
            }

            // Create new report
            const report = new Report({
                  postId,
                  reporterId,
                  reason: reason || 'other',
                  description: description || ''
            });

            await report.save();

            console.log(`Post ${postId} reported by user ${reporterId} for reason: ${reason}`);

            return res.status(201).json({
                  message: 'Post reported successfully. We will review it shortly.',
                  reportId: report._id
            });

      } catch (error) {
            console.error('Error reporting post:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
      }
};
