import express from "express";
import multer from "multer";
import { createPost, getPosts } from "../controllers/postController.js";
import { authMiddleware } from "../controllers/authController.js";

const router = express.Router();

// simple multer disk storage (works in Codespaces)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure folder exists
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// create post (with optional file)
router.post("/", authMiddleware, upload.single("media"), createPost);
router.get("/", getPosts);

export default router;