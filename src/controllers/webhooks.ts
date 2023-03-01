import { Request, Response } from "express";
import { getlocationPointOfInterest } from "../handles/handlePointOfInterest";
import { getlocationRestaurants } from "../handles/handleRestaurant";
import { getlocationActivitys } from "../handles/handleActivity";
import { getlocationHotels } from "../handles/handleHotel";
import { sessionClient, sessionPath } from "../configs/dialogflow";
import { replyMessage } from "../services/linesdk/linesdkService";
import { postToDialogflow } from "../services/dialogflows/dialogflowService";
import { saveChats, getChats } from "../models/chatHistorys";

async function webhooksController(req: Request, res: Response) {
  const event = req.body.events[0];
  console.log("log events",req.body.events);
  
  // console.log("log keyword",event[0].keywords);
  console.log("log keyword",req.body.events[0].message.keywords);
  if (event.type === "message" && event.message.type === "text") {
    try {
      await postToDialogflow(req);
      console.log("TEST OK");
      const requestIntent = {
        session: sessionPath,
        queryInput: {
          text: {
            text: event.message.text,
            languageCode: "th-TH",
          },
        },
      };
      const responses = await sessionClient.detectIntent(requestIntent);
      const result: any = responses[0].queryResult;
      const intent = result.intent.displayName;

      if (
        intent === "โรงพยาบาล" ||
        intent === "ร้านค้า" ||
        intent === "ปั้มน้ำมัน" ||
        intent === "ธนาคาร" ||
        intent === "ตลาด" ||
        intent === "ร้านกาแฟ" ||
        intent === "ร้านซ่อมรถ" ||
        intent === "ร้านถ่ายรูป" ||
        intent === "วัด" ||
        intent === "ร้านอาหาร" ||
        intent === "ศาลเจ้าพ่อ" ||
        intent === "สถานีตำรวจ" ||
        intent === "สถานีรถไฟ" ||
        intent === "ที่พัก" ||
        intent === "กิจกรรม" 
      ) {
        await saveChats(
          event.source.userId,
          result.intent.displayName,
          event.message.text
        );
      }
    } catch (error: any) {
      res.send({ message: error.message });
    }
  } else if (event.type === "message" && event.message.type === "location") {
    try {
      const chats = await getChats(event.source.userId);
      let lastChat = chats[chats.length - 1];
      console.log("LAST_CHAT", lastChat);

      if (lastChat.intent_name === "ร้านอาหาร") {
        console.log("FOOD ON");
        return await getlocationRestaurants({
          intent: lastChat.intent_name,
          latitude: event.message.latitude,
          longitude: event.message.longitude,
          userId: event.source.userId,
        });
      } else if (lastChat.intent_name === "ที่พัก") {
        console.log("HOTEL ON");
        await getlocationHotels({
          intent: lastChat.intent_name,
          latitude: event.message.latitude,
          longitude: event.message.longitude,
          userId: event.source.userId,
        });
      } else if (lastChat.intent_name === "กิจกรรม") {
        console.log("ACTIVITY ON");
        await getlocationActivitys({
          intent: lastChat.intent_name,
          latitude: event.message.latitude,
          longitude: event.message.longitude,
          userId: event.source.userId,
        });
      } else {
        console.log("POI ON");
        await getlocationPointOfInterest({
          intent: lastChat.intent_name,
          latitude: event.message.latitude,
          longitude: event.message.longitude,
          userId: event.source.userId,
        });
      }
    } catch (error: any) {
      res.send({ message: error.message });
    }
  } else if (event.type === "message" && event.message.type === "sticker") {

    replyMessage(
      event.source.userId,
      `zazza ${event.message.keywords[0]}`
    );
    // try {
    //   await postToDialogflow(req);
    //   console.log("TEST OK");
      // const requestIntent = {
      //   session: sessionPath,
      //   queryInput: {
      //     text: {
      //       text: event.message.keywords[0],
      //       languageCode: "th-TH",
      //     },
      //   },
      // };
      // const responses = await sessionClient.detectIntent(requestIntent);
      // const result: any = responses[0].queryResult;
      // const intent = result.intent.displayName;

      //   await saveChats(
      //     event.source.userId,
      //     result.intent.displayName,
      //     event.message.text
      //   );

    // } catch (error: any) {
    //   res.send({ message: error.message });
    // }
  } 
  else {
    replyMessage(
      event.source.userId,
      `Sorry, this chatbot did not support message type ${event.message.type}`
    );
  }
}

export { webhooksController };
