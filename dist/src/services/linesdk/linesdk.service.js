"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reply = void 0;
const linesdk_1 = require("../../configs/linesdk");
const reply = (userId, message) => {
    linesdk_1.client.pushMessage(userId, {
        type: "text",
        text: message,
    });
};
exports.reply = reply;
