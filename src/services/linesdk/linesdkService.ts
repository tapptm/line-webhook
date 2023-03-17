import { client as clientsdk } from "../../configs/linesdk";

const replyMessage = (userId: string, message: string) => {
  clientsdk.pushMessage(userId, {
    type: "text",
    text: message,
  });
};

const getProfile = (userId: string) => {
  return clientsdk.getProfile(userId);
};

export { replyMessage, getProfile };
