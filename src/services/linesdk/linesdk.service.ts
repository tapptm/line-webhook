import { client as clientsdk } from "../../configs/linesdk";

const reply = (userId: string, message: string) => {
  clientsdk.pushMessage(userId, {
    type: "text",
    text: message,
  });
};

export { reply };
