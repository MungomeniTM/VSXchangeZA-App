import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// create post
export const createPost = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { text } = req.body;
    let media_url = "";
    let media_type = "";

    // if using multer upload and cloudinary
    if (req.file) {
      // req.file.path if using local storage; we expect multer memory or local path
      const result = await cloudinary.uploader.upload(req.file.path || req.file.buffer, {
        folder: "vsxchangeza_posts",
        resource_type: "auto"
      });
      media_url = result.secure_url;
      media_type = result.resource_type;
    } else if (req.body.media_url) {
      media_url = req.body.media_url;
      media_type = req.body.media_type || "";
    }

    const post = new Post({
      user: userId,
      text: text || "",
      media_url,
      media_type
    });

    await post.save();

    // emit via socket if available
    const io = req.app.get("io");
    io?.emit("newPost", { id: post._id, text: post.text, media_url: post.media_url });

    return res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "first_name last_name email avatar_url role").sort({ created_at: -1 }).limit(50);
    return res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};