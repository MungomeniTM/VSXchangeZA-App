import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_MIN = process.env.JWT_EXPIRES_MIN || 60 * 24 * 7; // minutes

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      first_name: first_name || "",
      last_name: last_name || "",
      email,
      password_hash: hash,
      role: role || "client"
    });

    await user.save();
    return res.status(201).json({ id: user._id, email: user.email, first_name: user.first_name, role: user.role });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, {
      expiresIn: `${JWT_EXPIRES_MIN}m`
    });

    return res.json({
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// middleware to protect routes
export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Authorization header missing" });
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}; 