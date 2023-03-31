import { client as line } from "../../configs/linesdk";

const replyMessage = (userId: string, message: string) => {
  line.pushMessage(userId, {
    type: "text",
    text: message,
  });
};

const replyMessageSTK = (
  userId: string,
  packageId: string,
  stickerId: string
) => {
  line.pushMessage(userId, {
    type: "sticker",
    packageId: packageId,
    stickerId: stickerId,
  });
};

const getProfile = (userId: string) => {
  return line.getProfile(userId);
};

export { replyMessage, getProfile, replyMessageSTK };
