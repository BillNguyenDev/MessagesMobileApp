import dotenv from "dotenv";
dotenv.config();

export const urlMongo = `mongodb+srv://${process.env.DATA_NAME}:${process.env.DATA_PASSWORD}@cluster0-u4fr6.mongodb.net/messageApp_v1?retryWrites=true&w=majority`;
export const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
export const connectFunc = (err: any) => {
  if (!err) {
    console.log("Mongo connected sucessfully");
  } else {
    console.log(err);
  }
};
