import { client as clientsdk } from "../../configs/linesdk";

const replyMessage = (userId: string, message: string) => {
  clientsdk.pushMessage(userId, {
    type: "text",
    text: message,
  });
};

export { replyMessage };
