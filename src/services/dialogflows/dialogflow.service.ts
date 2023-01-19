import request from "request-promise";

const postToDialogflow = (req: any) => {
  const body = JSON.stringify(req.body);
  req.headers.host = "dialogflow.cloud.google.com";

  return request.post({
    uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/db967922-963c-485d-9d00-c33519ed5177",
    headers: req.headers,
    body: body,
  });
};

export { postToDialogflow };
