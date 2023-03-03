import { Request, Response, NextFunction } from "express";
import { pushMessageActivityTH } from "../handles/handleActivity";
import { sessionClient, sessionPath } from "../configs/dialogflow";
import { replyMessage } from "../services/linesdk/linesdkService";
import { postToDialogflow } from "../services/dialogflows/dialogflowService";
import { saveChats, getChats } from "../models/chatHistorys";
import { client } from "../configs/linesdk";

async function textController(req: Request, res: Response, next: NextFunction) {
  const event = req.body.events[0];
  console.log("log text events", req.body.events);
  if (event.type === "message" && event.message.type === "text") {
    return await postToDialogflow(req);
  }
  next();
}

async function locationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = req.body.events[0];
  console.log("log location events", req.body.events);
  if (event.type === "message" && event.message.type === "location") {
    return await pushMessageActivityTH({
      latitude: event.message.latitude,
      longitude: event.message.longitude,
      userId: event.source.userId,
    });
  }
  next();
}

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
  }
  next();
}

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
  }
  next();
}

async function webhooksController(req: Request, res: Response) {
  const event = req.body.events[0];
  console.log("log events", req.body.events);
  // console.log("log keyword", req.body.events[0].message.keywords);

  // if (event.type === "message" && event.message.type === "text") {
  //   try {
  //     await postToDialogflow(req);
  //     console.log("TEST OK");
  //     const requestIntent = {
  //       session: sessionPath,
  //       queryInput: {
  //         text: {
  //           text: event.message.text,
  //           languageCode: "th-TH",
  //         },
  //       },
  //     };
  //     const responses = await sessionClient.detectIntent(requestIntent);
  //     const result: any = responses[0].queryResult;
  //     const intent = result.intent.displayName;
  //     console.log("intent", result);

  //     await saveChats(
  //       event.source.userId,
  //       result.intent.displayName,
  //       event.message.text
  //     );
  //   } catch (error: any) {
  //     res.send({ message: error.message });
  //   }
  // } else
  // if (event.type === "message" && event.message.type === "location") {
  //   // const chats = await getChats(event.source.userId);
  //   // let lastChat = chats[chats.length - 1];
  //   // console.log("LAST_CHAT", lastChat);

  //   console.log("ACTIVITY ON");
  //   await pushMessageActivityTH({
  //     // intent: lastChat.intent_name,
  //     latitude: event.message.latitude,
  //     longitude: event.message.longitude,
  //     userId: event.source.userId,
  //   });
  // } else
  // if (event.type === "message" && event.message.type === "sticker") {
  //   // console.log("log keyword", req.body.events[0].message.keywords);
  //   event.message.keywords.forEach((keyword: any) => {
  //     replyMessage(event.source.userId, keyword);
  //   });
  // } else

  // if (event.type === "message" && event.message.type === "image") {
  //   const messageContent = await client.getMessageContent(event.message.id);
  //   console.log("log events image", messageContent);
  // } else {
  replyMessage(
    event.source.userId,
    `ขอโทษค่ะ น้องชบาไม่สามารถตอบกลับข้อความประเภท "${event.message.type}" ได้ค่ะ`
  );
  // }
}

export {
  textController,
  locationController,
  stickerController,
  imageController,
  webhooksController,
};
