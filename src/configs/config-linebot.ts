import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.LINE_ACCESS_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + TOKEN,
};

const urlReply = "api.line.me/v2/bot/message/reply"

export { headers, urlReply };
