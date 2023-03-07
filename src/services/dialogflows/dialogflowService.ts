import request from "request-promise";
import { sessionClient, sessionPath } from "../../configs/dialogflow";
import dotenv from "dotenv";
dotenv.config();

const postToDialogflow = async (req: any) => {
  const body = JSON.stringify(req.body);
  req.headers.host = "dialogflow.cloud.google.com";

  return await request.post({
    uri: process.env.DIALOGFLOW_WEBHOOK + "",
    headers: req.headers,
    body: body,
  });
};

const detectIntent = async (textMessage: string) => {
  const requestIntent = {
    session: sessionPath,
    queryInput: {
      text: {
        text: textMessage,
        languageCode: "th-TH",
      },
    },
  };
  const responses = await sessionClient.detectIntent(requestIntent);
  const result: any = responses[0].queryResult;
  return result;
};

export { detectIntent, postToDialogflow };
