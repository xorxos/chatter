import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide a userName"],
  },
  rgbColor: {
    type: String,
    required: [true, "Please provide a display color"],
  },
  content: {
    type: String,
    required: [true, "Please provide a message"],
  },
});

export default mongoose.model("Message", MessageSchema);
