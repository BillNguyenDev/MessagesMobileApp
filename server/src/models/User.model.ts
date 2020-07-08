import { Schema, model } from "mongoose";

const users = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: "NewMember",
  },
  urlavatar:{
    type:String,
    default:'',
  },
  phone: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  twitter: {
    type: String,
    default: "",
  },
  facebook: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  slack: {
    type: String,
    default: "",
  },
  listfriend: [{ type: Schema.Types.ObjectId, default: [] }],
  listroom: [{ type: Schema.Types.ObjectId, default: [] }],
});

export default model("users", users);
