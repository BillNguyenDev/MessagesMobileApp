import { Request, Response, NextFunction } from "express";
import usersModel from "../models/User.model";
import bcrypt from "bcrypt";
import UserModel from "../models/User.model";
const fs = require("fs");
const cloud = require("../configuration/cloudinaryConfig");

const jwt = require("jsonwebtoken");

// change account info
export const account = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const userInfo: any = await usersModel.findById(user._id);
      updateAccount(userInfo, req);
      console.log(req.body);
      res.json(userInfo); // chinh lai sau
    }
  );
};

const updateAccount = async (oldData: any, req: any) => {
  let result: any = { url: oldData.urlavatar };
  const { name, phone, bio } = req.body;
  console.log(req.body);
  try {
    result = await cloud.uploads(req.files[0].path);
    fs.unlinkSync(req.files[0].path);

    usersModel.findOneAndUpdate(
      { _id: oldData._id },
      { $set: { urlavatar: result.url, name: name, phone: phone, bio: bio } },
      (err) => {
        console.log("loi: ", err);
      }
    );
  } catch {
    usersModel.findOneAndUpdate(
      { _id: oldData._id },
      { $set: { name: name, phone: phone, bio: bio } },
      (err) => {
        console.log("loi: ", err);
      }
    );
  }
};

// change password

export const password = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { currentPassword, newPassword } = req.body;
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const userInfo: any = await usersModel.findById(user._id);
      // if (userInfo == null) {
      //   return res.status(400).json({ msg: "Not found user" });
      // }
      if (await bcrypt.compare(currentPassword, userInfo.password)) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        try {
          console.log(hashedPassword);
          usersModel.findByIdAndUpdate(
            userInfo._id,
            {
              $set: { password: hashedPassword },
            },
            (err) => console.log(err)
          );
          res.status(200).json({ msg: "Done", email: userInfo.email });
        } catch (e) {
          res.status(400).json({ err: e });
        }
      } else {
        res.status(400).json({ msg: "Not Allowed" });
      }
    }
  );
};

// change social info
export const social = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const userInfo: any = await usersModel.findOne({ email: user.email });
      const { facebook, twitter, instagram, github, slack } = req.body;
      console.log(req.body);
      usersModel.findByIdAndUpdate(
        userInfo._id,
        {
          $set: {
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
            github: github,
            slack: slack,
          },
        },
        (err) => {
          console.log(err);
        }
      );
      res.json(userInfo); // chinh lai sau
    }
  );
};

// add Friend

export const addFriend = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const userInfo: any = await usersModel.findOne({ email: user.email });

      if (user.email == req.body.email)
        return res.status(400).json({ msg: "Not addFriend with yourself" });
      const friendInfo: any = await usersModel.findOne({
        email: req.body.email,
      });

      if (friendInfo == null)
        return res.status(400).json({ msg: "Not Found Friend" });
      if (userInfo.listfriend.indexOf(friendInfo._id) > -1)
        return res.json({ msg: "Already exist" });
      usersModel.findByIdAndUpdate(
        userInfo._id,
        {
          $push: {
            listfriend: friendInfo._id,
          },
        },
        (err) => {
          console.log(err);
        }
      );
      res.status(200); // chinh lai sau
    }
  );
};
