"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlReply = exports.headers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + TOKEN,
};
exports.headers = headers;
const urlReply = "api.line.me/v2/bot/message/reply";
exports.urlReply = urlReply;
