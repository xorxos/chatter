import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import cors from "cors";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import "express-async-errors";

import morgan from "morgan";

import { createServer } from "http";
import { Server } from "socket.io";

import Message from "./models/Message.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use(helmet({ contentSecurityPolicy: false }));

app.use(xss());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5000",
      "http://localhost:5000",
      "http://localhost:10000",
      "https://chatter.parkerleavitt.com",
      "https://chatter-qn2v.onrender.com",
      "http://chatter-qn2v:10000",
    ],
  },
});

const WELCOME_MESSAGE = {
  author: { rgbColor: "darkorchid", userName: "WelcomeBot" },
  content: "Welcome to Chatter!",
};

const start = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);

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
    });
  } catch (error) {
    console.log(error);
  }
};

start();
