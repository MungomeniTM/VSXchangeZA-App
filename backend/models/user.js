import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, default: "" },
  last_name: { type: String, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, default: "client" },
  location: { type: String, default: "" },
  avatar_url: { type: String, default: "" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);