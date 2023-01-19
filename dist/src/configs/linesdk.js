"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bot_sdk_1 = require("@line/bot-sdk");
dotenv_1.default.config();
const AC_TOKEN = process.env.LINE_ACCESS_TOKEN;
const SC_TOKEN = process.env.LINE_SECRET_KEY;
const client = new bot_sdk_1.Client({
    channelAccessToken: AC_TOKEN + "",
    channelSecret: SC_TOKEN,
});
exports.client = client;
