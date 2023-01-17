"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGreeting = void 0;
const actions_on_google_1 = require("actions-on-google");
function getGreeting(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        const conv = agent.conv();
        conv.ask(new actions_on_google_1.Permission({
            context: "To locate you",
            permissions: "DEVICE_PRECISE_LOCATION",
        }));
        // agent.add("Hello I am Webhook demo How are you...");
    });
}
exports.getGreeting = getGreeting;
