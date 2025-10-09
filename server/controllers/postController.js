import Post from '../models/Post.js'
import mongoose from 'mongoose';

export const postGet = async (req, res) => {
      try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  console.warn(`[!] Invalid ObjectId: ${id}`);
                  return res.status(400).json({ message: "Invalid User ID" });
            }

            const posts = await Post.find({ authorId: id });
            if (posts.length > 0) {
                  console.log(`${posts.length} posts found for user ${id}`);
                  return res.status(200).json({ message: "All Posts Fetched!!", posts });
            } else {
                  console.warn(`No posts found!!`);
                  return res.status(404).json({ message: "Posts Not Found!!" });
            }

      } catch (error) {
            console.log("User Invalid!!",error.stack)
            return res.status(500).json({ message: "Failed to Fetch All Posts" })
      }

}

export const postCreate = async (req, res) => {
      try {
            const { authorId, content, attachments } = req.body;
            if (!authorId || !content) {
                  return res.status(400).json({ message: "authorId and content are required" });
            }
            const newPost = new Post({
                  authorId,
                  content,
                  attachments: attachments || [],
            });
            await newPost.save();
            return res.status(201).json({ message: "Post created SuccessFully!!" });
      } catch (error) {
            console.log('Post Bnane me Error!', error);
            return res.status(500).json({ message: "Internal Server Error!" })
      }

}
export const postDelete = async (req, res) => {
      try {
            const postId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                  console.warn(`[!] Invalid ObjectId: ${postId}`);
                  return res.status(400).json({ message: "Invalid Post ID" });
            }

            const delPost = await Post.findByIdAndDelete(postId); //it will return the content of deleted post if found and deleted else null
            if (delPost) {
                  console.log("Post Deleted!");
                  return res.status(200).json({ message: "Post deleted successfully!!"});
            } else {
                  console.log("No Post Found!");
                  return res.status(404).json({ message: "Post Not Found!" });
            }
      } catch (error) {
            console.log('Error: ', error);
            return res.status(500).json({ message: "Internal Server Error!" });
      }
}
