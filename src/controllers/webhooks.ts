import { Request, Response, NextFunction } from "express";
import { pushMessageActivity } from "../handles/handleActivity";
import { replyMessage } from "../services/linesdk/linesdkService";
import {
  detectIntent,
  postToDialogflow,
} from "../services/dialogflows/dialogflowService";
import { saveChats, getChats } from "../models/chatHistorys";
import { client } from "../configs/linesdk";

/** text controller */
async function textController(req: Request, res: Response, next: NextFunction) {
  const event = req.body.events[0];
  console.log("log text events", req.body.events);
  if (event.type === "message" && event.message.type === "text") {
    await postToDialogflow(req);
    const result = await detectIntent(event.message.text);
    return await saveChats(
      event.source.userId,
      result.intent.displayName,
      event.message.text
    );
  }
  next();
}

/** location controller */
async function locationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = req.body.events[0];
  console.log("log location events", req.body.events);
  if (event.type === "message" && event.message.type === "location") {
    const chats = await getChats(event.source.userId);
    let lastChat = chats[chats.length - 1];

    return await pushMessageActivity({
      latitude: event.message.latitude,
      longitude: event.message.longitude,
      userId: event.source.userId,
      message: lastChat
    });
  }
  next();
}

/** sticker controller */
async function stickerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = req.body.events[0];
  console.log("log sticker events", req.body.events);
  if (event.type === "message" && event.message.type === "sticker") {
    // console.log("log keyword", req.body.events[0].message.keywords);
    event.message.keywords.forEach((keyword: any) => {
      replyMessage(event.source.userId, keyword);
    });
    return;
  }
  next();
}

/** image controller */
async function imageController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = req.body.events[0];
  console.log("log image events", req.body.events);
  if (event.type === "message" && event.message.type === "image") {
    const messageContent = await client.getMessageContent(event.message.id);
    console.log("log events image", messageContent);
    return;
  }
  next();
}

/** no type controller */
async function noTypeController(req: Request, res: Response) {
  const event = req.body.events[0];
  console.log("log events", req.body.events);
  return replyMessage(
    event.source.userId,
    `ขอโทษค่ะ น้องชบาไม่สามารถตอบกลับข้อความประเภท "${event.message.type}" ได้ค่ะ`
  );
}

export {
  textController,
  locationController,
  stickerController,
  imageController,
  noTypeController,
};
