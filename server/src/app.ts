import http, { Server } from "http";
import express, { Application } from "express";
import socketio from "socket.io";
import dotenv from "dotenv";
import { stringify } from "querystring";
import { addUser, removeUser, getUser, getUsersInRoom } from "./models/users";
import { configurationHeader } from "./configuration/configurationHeader";
import {
  urlMongo,
  options,
  connectFunc,
} from "./configuration/mongooseConnect";
import mongoose from "mongoose";
import apiUser from "./routes/user.route";
import apiRoom from "./routes/room.route";
import apiSearch from "./routes/search.route";

import roomModel from "./models/Room.model";
dotenv.config();

const POST = 5000;

const app: Application = express();
const server: Server = http.createServer(app);
const connect = mongoose.connect(urlMongo, options, connectFunc);
const io: socketio.Server = socketio(server);
app.use(configurationHeader);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("images"));
app.use("/api/user", apiUser);
app.use("/api/room", apiRoom);
app.use("/api/search",apiSearch)

let usersOnline: any[] = [];
io.on("connect", (socket) => {
  socket.on("join", ({ id, room }: { id: string; room: string }) => {
    //save socket
    const user = {
      user_id: id,
      socket: socket.id,
    };
    usersOnline.push(user);
    // console.log(usersOnline);
    io.emit("join successful", { id });
  });
  socket.on("sendMessage", ({ sender, roomId, content, type, createdAt }) => {
    //check
    const message = {
      sender,
      content,
      createdAt,
      updatedAt: new Date(),
    };
    console.log(message, roomId);
    try {
      let usersInRoom: any[] = [];
      roomModel.findByIdAndUpdate(
        roomId,
        {
          $push: {
            message,
          },
        },
        (err, rooms: any) => {
          console.log(rooms);
          usersInRoom = rooms.list_id_member;
          console.log(usersInRoom);
          usersOnline.map((item: any) => {
            console.log(item);
            if (usersInRoom.indexOf(item.user_id) > -1) {
              io.to(item.socket).emit("Output message", message);
            }
          });
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
});

server.listen(POST, () => console.log("Server running"));
