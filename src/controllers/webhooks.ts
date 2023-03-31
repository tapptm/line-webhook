import { Request, Response, NextFunction } from "express";
import {
  pushMessageActivity,
  pushMessagePoint,
} from "../handles/handleActivity";
import { replyMessage ,replyMessageSTK } from "../services/linesdk/linesdkService";
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
    const result = await detectIntent(event.message.text);
    await saveChats(
      event.source.userId,
      result.intent.displayName,
      event.message.text
    );
    if (
      event.message.text === "รายละเอียดจุดที่ 1" ||
      event.message.text === "รายละเอียดจุดที่ 2" ||
      event.message.text === "รายละเอียดจุดที่ 3" ||
      event.message.text === "รายละเอียดจุดที่ 4" ||
      event.message.text === "รายละเอียดจุดที่ 5" ||
      event.message.text === "รายละเอียดจุดที่ 6" ||
      event.message.text === "รายละเอียดจุดที่ 7" ||
      event.message.text === "รายละเอียดจุดที่ 8" ||
      event.message.text === "รายละเอียดจุดที่ 9" ||
      event.message.text === "รายละเอียดจุดที่ 10" ||
      event.message.text === "รายละเอียดจุดที่ 11" ||
      event.message.text === "รายละเอียดจุดที่ 12" ||
      event.message.text === "รายละเอียดจุดที่ 13" ||
      event.message.text === "รายละเอียดจุดที่ 14" ||
      event.message.text === "รายละเอียดจุดที่ 15" ||
      event.message.text === "รายละเอียดจุดที่ 16" ||
      event.message.text === "รายละเอียดจุดที่ 17" ||
      event.message.text === "รายละเอียดจุดที่ 18" ||
      event.message.text === "รายละเอียดจุดที่ 19" ||
      event.message.text === "รายละเอียดจุดที่ 20" ||
      event.message.text === "รายละเอียดจุดที่ 21" ||
      event.message.text === "รายละเอียดจุดที่ 22"
    ) {
      const point = event.message.text.replace(/\D/g, "");
      const chats = await getLocation(event.source.userId);
      const lang = await getChats(event.source.userId);
      let lastChat;

      switch (lang.length) {
        case 0:
          lastChat = { intent_name: "" };
          break;
        default:
          lastChat = lang[lang.length - 1];
          break;
      }
      if (chats.length > 0) {
        return await pushMessagePoint({
          latitude: chats[0].latitude, // user location
          longitude: chats[0].longitude, // user location
          userId: event.source.userId,
          intent: lastChat.intent_name,
          point_id: Number(point),
        });
      } else {
        return await pushMessagePoint({
          latitude: 0, // user location
          longitude: 0, // user location
          userId: event.source.userId,
          intent: lang[0].intent_name,
          point_id: Number(point),
        });
      }
    } else if ( 
            result.intent.displayName === "จุดท่องเที่ยวที่01 : พิพิธพันธ์พื้นบ้านพระไม้มงคล" ||
            result.intent.displayName === "จุดท่องเที่ยวที่02 : วิหารหลวงพ่อหนุนดวง" ||
            result.intent.displayName === "จุดท่องเที่ยวที่03 : ศิลปะหน้าบันหลวงพ่อหนุนดวง" ||
            result.intent.displayName === "จุดท่องเที่ยวที่04 : หลวงพ่อหนุนดวง" ||
            result.intent.displayName === "จุดท่องเที่ยวที่05 : ธรรมาสน์หลวงล้านนาไม้สักทอง" ||
            result.intent.displayName === "จุดท่องเที่ยวที่06 : บานประตูพระปางเปิดโลก" ||
            result.intent.displayName === "จุดท่องเที่ยวที่07 : พระปางรำพึง" ||
            result.intent.displayName === "จุดท่องเที่ยวที่08 : พญาลิงก่อนทางขึ้นถ้ำ" ||
            result.intent.displayName === "จุดท่องเที่ยวที่09 : พระพุทธรัตนปัญจมหามุนี (พระหยกขาว)" ||
            result.intent.displayName === "จุดท่องเที่ยวที่10 : หอไตรและศาลาราย" ||
            result.intent.displayName === "จุดท่องเที่ยวที่11 : น้ำตกสายธาราน้ำบ่อแก้ว" ||
            result.intent.displayName === "จุดท่องเที่ยวที่12: มณฑปพระครูบาเจ้าศรีวิชัย" ||
            result.intent.displayName === "จุดท่องเที่ยวที่13 : ถ้ำน้ำบ่อแก้ว" ||
            result.intent.displayName === "จุดท่องเที่ยวที่14 : น้ำบ่อแก้ว" ||
            result.intent.displayName === "จุดท่องเที่ยวที่15 : ขรัวบุญ" ||
            result.intent.displayName === "จุดท่องเที่ยวที่16: จุดชมวิวอุทยานแห่งชาติแม่วะ" ||
            result.intent.displayName === "จุดท่องเที่ยวที่17: พระธาตุรัตนจังคุลี" ||
            result.intent.displayName === "จุดท่องเที่ยวที่18 : ต้นปอ" ||
            result.intent.displayName === "จุดท่องเที่ยวที่19 : ถ้ำครูบาต่อมคำ" ||
            result.intent.displayName === "จุดท่องเที่ยวที่20 : สำนักงานเจ้าคณะตำบลพระบาทวังตวง" ||
            result.intent.displayName === "จุดท่องเที่ยวที่21 : ห้องสุขา" ||
            result.intent.displayName === "จุดท่องเที่ยวที่22 : ศาลาแต้มธรรม"){

      const point = result.intent.displayName.replace(/\D/g, "");
console.log("pointlogpoint",point);

      const chats = await getLocation(event.source.userId);
       const lang = await getChats(event.source.userId);
       let lastChat;

       switch (lang.length) {
         case 0:
           lastChat = { intent_name: "" };
           break;
         default:
           lastChat = lang[lang.length - 1];
           break;
       }
      if (chats.length > 0) {
        return await pushMessagePoint({
          latitude: chats[0].latitude, // user location
          longitude: chats[0].longitude, // user location
          userId: event.source.userId,
          intent: lastChat.intent_name,
          point_id: Number(point),
        });
      } else {
        return await pushMessagePoint({
          latitude: 0, // user location
          longitude: 0, // user location
          userId: event.source.userId,
          intent: lang[0].intent_name,
          point_id: Number(point),
        });
      }

    } 
    else {
      await postToDialogflow(req);
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
    // event.message.keywords.forEach((keyword: any) => {
    //   replyMessage(event.source.userId, keyword);
    // });
    const replystk = "น้องใบโพธิ์ยังไม่สามารถตอบกลับพี่ๆในรูปแบบสติ๊กเกอร์ได้นะคะ";
    const packageId ="11537";
    const stickerId =["52002771", "52002734", "52002735", "52002738", "52002741", "52002746"];
      // replyMessage(event.source.userId, replystk);
      replyMessageSTK(event.source.userId,packageId ,stickerId[Math.floor(Math.random()*stickerId.length)]);

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
  console.log("log events type", event.message.type);
  
  if (event.type === "message" && event.message.type != "location" || event.message.type != "sticker" || event.message.type != "image"  || event.message.type != "text") {
  return replyMessage(
    event.source.userId,
    `ขอโทษค่ะ น้องชบาไม่สามารถตอบกลับข้อความประเภท "${event.message.type}" ได้ค่ะ`
  );
}
}

export {
  textController,
  locationController,
  stickerController,
  imageController,
  noTypeController,
};
