import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";


await connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // accept JSON bodies
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "VSXchangeZA backend running" }));

// http + socket.io
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: { origin: "*" }
});

// simple socket events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("joinRoom", (room) => socket.join(room));
  socket.on("leaveRoom", (room) => socket.leave(room));
  socket.on("sendMessage", (payload) => {
    // payload { room, message, sender }
    if (payload.room) io.to(payload.room).emit("message", payload);
  });
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// make io available to controllers via app.locals
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));