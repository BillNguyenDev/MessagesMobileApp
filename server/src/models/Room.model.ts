import { Schema, model } from "mongoose";

const room = new Schema({
  name: {
    type: String,
    default: "",
  },
  topic: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  photoUrl: {
    type: String,
    default: "",
  },
  list_id_member: [{ type: Schema.Types.ObjectId, required: true }],
  message: [
    {
      sender: { type: Schema.Types.ObjectId, required: true },
      content: { type: String, required: true },
      createdAt: { type: String, required: true },
      updatedAt: { type: Date, required: true },
    },
  ],
});

export default model("rooms", room);
