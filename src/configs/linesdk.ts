import dotenv from "dotenv";
import { Client } from "@line/bot-sdk";
dotenv.config();

const AC_TOKEN = process.env.LINE_ACCESS_TOKEN;
const SC_TOKEN = process.env.LINE_SECRET_KEY;

const client = new Client({
  channelAccessToken: AC_TOKEN + "",
  channelSecret: SC_TOKEN,
});

export { client };
