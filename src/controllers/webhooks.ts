import { Request, Response, NextFunction } from "express";
import {
  pushMessageActivity,
  pushMessagePoint,
} from "../handles/handleActivity";
import { replyMessage } from "../services/linesdk/linesdkService";
import {
  detectIntent,
  postToDialogflow,
} from "../services/dialogflows/dialogflowService";
import {
  saveChats,
  getChats,
  saveLocation,
  getLocation,
} from "../models/chatHistorys";
import { client } from "../configs/linesdk";

/** text controller */
async function textController(req: Request, res: Response, next: NextFunction) {
  const event = req.body.events[0];
  console.log("log text events", req.body.events);
  if (event.type === "message" && event.message.type === "text") {
    if (
      event.message.text === "จุดท่องเที่ยวที่ 1" ||
      event.message.text === "จุดท่องเที่ยวที่ 2" ||
      event.message.text === "จุดท่องเที่ยวที่ 3" ||
      event.message.text === "จุดท่องเที่ยวที่ 4" ||
      event.message.text === "จุดท่องเที่ยวที่ 5" ||
      event.message.text === "จุดท่องเที่ยวที่ 6" ||
      event.message.text === "จุดท่องเที่ยวที่ 7" ||
      event.message.text === "จุดท่องเที่ยวที่ 8" ||
      event.message.text === "จุดท่องเที่ยวที่ 9" ||
      event.message.text === "จุดท่องเที่ยวที่ 10" ||
      event.message.text === "จุดท่องเที่ยวที่ 11" ||
      event.message.text === "จุดท่องเที่ยวที่ 12" ||
      event.message.text === "จุดท่องเที่ยวที่ 13" ||
      event.message.text === "จุดท่องเที่ยวที่ 14" ||
      event.message.text === "จุดท่องเที่ยวที่ 15" ||
      event.message.text === "จุดท่องเที่ยวที่ 16" ||
      event.message.text === "จุดท่องเที่ยวที่ 17" ||
      event.message.text === "จุดท่องเที่ยวที่ 18" ||
      event.message.text === "จุดท่องเที่ยวที่ 19" ||
      event.message.text === "จุดท่องเที่ยวที่ 20" ||
      event.message.text === "จุดท่องเที่ยวที่ 21" ||
      event.message.text === "จุดท่องเที่ยวที่ 22"
    ) {
      const point = event.message.text.replace(/\D/g, "");

      const result = await detectIntent(event.message.text);
      await saveChats(
        event.source.userId,
        result.intent.displayName,
        event.message.text
      );
      const chats = await getLocation(event.source.userId);
      if (chats.length > 0) {
        return await pushMessagePoint({
          latitude: chats[0].latitude, // user location
          longitude: chats[0].longitude, // user location
          userId: event.source.userId,
          intent: chats[0].intent_name,
          point_id: Number(point),
        });
      }else{
        return await pushMessagePoint({
          latitude: 0, // user location
          longitude: 0, // user location
          userId: event.source.userId,
          intent: "",
          point_id: Number(point),
        });
      }
    } else {
      await postToDialogflow(req);
      const result = await detectIntent(event.message.text);
      return await saveChats(
        event.source.userId,
        result.intent.displayName,
        event.message.text
      );
    }
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
    await saveLocation(
      event.source.userId,
      event.message.latitude,
      event.message.longitude
    );

    const chats = await getChats(event.source.userId);
    let lastChat;

    switch (chats.length) {
      case 0:
        lastChat = { intent_name: "" };
        break;
      default:
        lastChat = chats[chats.length - 1];
        break;
    }

    return await pushMessageActivity({
      latitude: event.message.latitude, // user location
      longitude: event.message.longitude, // user location
      userId: event.source.userId,
      intent: lastChat.intent_name,
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
