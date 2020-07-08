import { Request, Response, NextFunction } from "express";
import roomModel from "../models/Room.model";
import usersModel from "../models/User.model";
const fs = require("fs");
const cloud = require("../configuration/cloudinaryConfig");
const jwt = require("jsonwebtoken");

export const createRoom = async (req: any, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let result: any = { url: "" };
  let photoUrl = "";
  try {
    result = await cloud.uploads(req.files[0].path);
    fs.unlinkSync(req.files[0].path);
    photoUrl = result.url;
  } catch {
    photoUrl = "";
  }
  let { name, topic, description, list_id_member } = req.body;
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const userInfo: any = await usersModel.findById(user._id);
      if (userInfo == null) return res.sendStatus(403);

      try {
        list_id_member = [...list_id_member, user._id];
        const room = new roomModel({
          name,
          topic,
          photoUrl,
          description,
          list_id_member,
          message: [],
        });
        room.save();
        list_id_member.map((item: any) => {
          usersModel.findByIdAndUpdate(
            item,
            { $push: { listroom: room._id } },
            (err) => console.log(err)
          );
        });
        res.status(201).json({ data: room });
      } catch {
        res.status(500).send();
      }
    }
  );
};

export const getMessages = async (req: Request, res: Response) => {
  const { skip, _id } = req.query;
  console.log(req.query);
  const data = await roomModel.findById(_id, (err: any, res: any) => {
    console.log(res.message);
    return res.message;
  });
  res.json({ msg: data });
};

export const updateInfoRoom = (req: Request, res: Response) => {};
//for dev
export const getListRoom = async (req: Request, res: Response) => {
  const listRoom = await roomModel.find();
  res.json(listRoom);
};
