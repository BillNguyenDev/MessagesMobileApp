import { Request, Response, NextFunction } from "express";
import mongoose, { Schema, model } from "mongoose";
import usersModel from "../models/User.model";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const jwt = require("jsonwebtoken");
let refreshTokens: any[] = [];

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: any = await usersModel.findOne({ email });
  if (user == null) {
    return res.status(400).json({ msg: "Not found user" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json(sendTokenLogin(user.email, user._id));
    } else {
      res.json({ msg: "Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
  res.json({ email, password });
};

export const getNewToken = (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ email: user.email });
      res.json({ accessToken: accessToken });
    }
  );
};

export const logout = (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};

export const getInfo = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const userInfo: any = await usersModel.findById(user._id);
      res.json(userInfo);
    }
  );
};

export const register = (req: Request, res: Response) => {
  res.json("register controller");
  /**
   * bo sung phan xac nhan mail
   */
};

export const getListFriend = async (req: Request, res: Response) => {
  const userInfo: any = await usersModel.findById(req.body.user._id);
  const { listfriend } = userInfo;
  usersModel.find({ _id: { $in: listfriend } }, (err, data) => {
    const result = data.map((item: any) => {
      return {
        _id: item.id,
        name: item.name,
        urlavatar: item.urlavatar,
        email: item.email,
      };
    });
    res.json({ data: result });
  });
};

//function common
function sendTokenLogin(email: string, _id: string) {
  const user: any = { email, _id };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return { accessToken, refreshToken };
}

function generateAccessToken(email: object) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600s",
  });
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check lai
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.body.user = user;
    next();
  });
};
//dev check list  users
export const getListUsers = async (req: Request, res: Response) => {
  const listUsers = await usersModel.find();
  res.json(listUsers);
};
export const addUser = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { email: req.body.email, password: hashedPassword };
    console.log(user);
    const newUser = new usersModel(user);
    newUser.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
};
