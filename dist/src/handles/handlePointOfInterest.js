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
exports.getlocation = void 0;
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const poiCalculateDistance_1 = require("../utils/poiCalculateDistance");
const carouselPayload_1 = require("../payloads/carouselPayload");
function getlocation(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        /** calculate distance from your current location **/
        const distanceData = yield (0, poiCalculateDistance_1.calculateDistance)(agent.intent, // set your intent name here.
        14.9881753, // set your locations here.
        102.1198264 // set your locations here.
        );
        /** condition to check if radius in 50 km
         * it will return text. if not it will
         * return custom payload. **/
        if (distanceData.length > 0) {
            /** format custom payload for line bot **/
            const payload = (0, carouselPayload_1.carouselPayloads)(distanceData);
            console.log(JSON.stringify(payload));
            return agent.add(new dialogflow_fulfillment_1.Payload("LINE", payload, {
                rawPayload: true,
                sendAsMessage: true,
            }));
        }
        return agent.add("ไม่พบข้อมูล" + agent.intent + "ในระยะ (100km)");
    });
}
exports.getlocation = getlocation;
