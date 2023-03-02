import { Request, Response } from "express";
import { getlocationPointOfInterest } from "../handles/handlePointOfInterest";
import { getlocationRestaurants } from "../handles/handleRestaurant";
import { getlocationActivitys } from "../handles/handleActivity";
import { getlocationHotels } from "../handles/handleHotel";
import { sessionClient, sessionPath } from "../configs/dialogflow";
import { replyMessage } from "../services/linesdk/linesdkService";
import { postToDialogflow } from "../services/dialogflows/dialogflowService";
import { saveChats, getChats } from "../models/chatHistorys";
import { client } from "../configs/linesdk";

async function webhooksController(req: Request, res: Response) {
  const event = req.body.events[0];
  console.log("log events", req.body.events);

  // console.log("log keyword", req.body.events[0].message.keywords);

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
      console.log("intent", result);

      await saveChats(
        event.source.userId,
        result.intent.displayName,
        event.message.text
      );
    } catch (error: any) {
      res.send({ message: error.message });
    }
  } else if (event.type === "message" && event.message.type === "location") {
    try {
      // const chats = await getChats(event.source.userId);
      // let lastChat = chats[chats.length - 1];
      // console.log("LAST_CHAT", lastChat);

      // if (lastChat.intent_name === "กิจกรรม") {
      console.log("ACTIVITY ON");
      await getlocationActivitys({
        // intent: lastChat.intent_name,
        latitude: event.message.latitude,
        longitude: event.message.longitude,
        userId: event.source.userId,
      });

      client.pushMessage(event.source.userId, {
        type: "image",
        originalContentUrl: "https://admin.trinitytrip.com/uploads/community/27/activity/activity_66166cbe192b16457c3aba5a5a5a7162_20221027041908000000.jpg",
        previewImageUrl: "https://admin.trinitytrip.com/uploads/community/27/activity/activity_66166cbe192b16457c3aba5a5a5a7162_20221027041908000000.jpg",
      });

      // }
      // else {
      //   replyMessage(
      //     event.source.userId,
      //     `ขอโทษค่ะ น้องชบาไม่พบจุดท่องเที่ยวบริเวณใกล้เคียงค่ะ`
      //   );
      // }
    } catch (error: any) {
      res.send({ message: error.message });
    }
  } else if (event.type === "message" && event.message.type === "sticker") {
    // for (let i = 0; i < event.message.keywords.length; i++) {
    //   console.log(event.message.keywords[i]);

    // const keywords : any = event.message.keywords
    event.message.keywords.forEach((keyword: any) => {
      replyMessage(event.source.userId, keyword);
    });

    // replyMessage(event.source.userId, `${event.message.keywords[0]}`);
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
  } else if (event.type === "message" && event.message.type === "image") {
    const messageContent = await client.getMessageContent(event.message.id);
    console.log("log events image", messageContent);

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
  } else {
    replyMessage(
      event.source.userId,
      `ขอโทษค่ะ น้องชบาไม่สามารถตอบกลับข้อความประเภท " ${event.message.type}" ได้ค่ะ`
    );
  }
}

export { webhooksController };
