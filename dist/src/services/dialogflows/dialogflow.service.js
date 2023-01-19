"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToDialogflow = void 0;
const request_promise_1 = __importDefault(require("request-promise"));
const postToDialogflow = (req) => {
    const body = JSON.stringify(req.body);
    req.headers.host = "dialogflow.cloud.google.com";
    return request_promise_1.default.post({
        uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/db967922-963c-485d-9d00-c33519ed5177",
        headers: req.headers,
        body: body,
    });
};
exports.postToDialogflow = postToDialogflow;
