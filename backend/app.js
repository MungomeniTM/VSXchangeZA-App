import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { Server } from "socket.io";

await connectDB();

const app = express();

// ✅ Improved CORS for mobile + ngrok + web compatibility
app.use(
  cors({
    origin: "*", // you can later restrict to specific origins like ["https://yourapp.ngrok-free.app"]
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, message: "VSXchangeZA backend running" })
);

// ✅ Create server + socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for socket.io too
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (room) => socket.join(room));
  socket.on("leaveRoom", (room) => socket.leave(room));
  socket.on("sendMessage", (payload) => {
    if (payload.room) io.to(payload.room).emit("message", payload);
  });

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// ✅ Make io accessible to controllers
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);