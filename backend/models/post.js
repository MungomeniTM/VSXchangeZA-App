import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, default: "" },
  media_url: { type: String, default: "" },
  media_type: { type: String, default: "" }, // image/video
  likes: { type: Number, default: 0 },
  approvals: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Post", PostSchema);