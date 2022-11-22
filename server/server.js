import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import http from "http";
import cors from "cors";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import "express-async-errors";

import morgan from "morgan";
import { Server } from "socket.io";

import Message from "./models/Message.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy-Report-Only",
    "default-src 'self'; connect-src 'self' http://localhost:5000; font-src 'self' https://fonts.gstatic.com; img-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self'; frame-src 'self'"
  );
  next();
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

const WELCOME_MESSAGE = {
  author: { rgbColor: "darkorchid", userName: "WelcomeBot" },
  content: "Welcome to Chatter!",
};

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("join", async (data) => {
    const chat = await Message.find({});
    io.to(socket.id).emit("load-chat", [...chat]);

    io.to(socket.id).emit("new-message", { ...WELCOME_MESSAGE });
    io.emit("joined", {
      author: WELCOME_MESSAGE.author,
      content: `${data.userName} has joined the chat!`,
    });
  });

  socket.on("message", async (data) => {
    const { content, author } = data;

    if (!content || !author) return;

    await Message.create({
      userName: author.userName,
      rgbColor: author.rgbColor,
      content,
    })
      .then()
      .catch((err) => console.log(err));

    io.emit("new-message", { author, content });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

const start = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
