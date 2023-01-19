import request from "request-promise";
import dotenv from "dotenv";
dotenv.config();

const postToDialogflow = (req: any) => {
  const body = JSON.stringify(req.body);
  req.headers.host = "dialogflow.cloud.google.com";

  return request.post({
    uri: process.env.DIALOGFLOW_WEBHOOK + "",
    headers: req.headers,
    body: body,
  });
};

export { postToDialogflow };
