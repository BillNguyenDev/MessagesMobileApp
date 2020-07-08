import { Request, Response, NextFunction } from "express";
import usersModel from "../models/User.model";

export const searchFriend = async (req: Request, res: Response) => {
  const { query } = req.body;
  const search = await usersModel.find({
    email: { $regex: "^[a-z0-9_@.]{0,100}" + query + "[a-z0-9_@.]{0,100}" },
  }).limit(5);
  const data = search.map((item: any) => {
    const { name, urlavatar, _id, email } = item;
    return { name, urlavatar, _id, email };
  });
  res.json({ data });
};
