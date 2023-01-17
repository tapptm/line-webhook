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
exports.getATMlocation = void 0;
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const calculateDistance_1 = require("../\u0E35utils/calculateDistance");
function getATMlocation(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        /** calculate distance from current location **/
        const distanceData = yield (0, calculateDistance_1.calculateDistance)(agent.intent, 14.9881753, 102.1198264);
        /** filter distance 50 km **/
        const filterInRadius = distanceData.filter((item) => item.distance_meters <= 50000);
        /** format custom payload for line **/
        const columns = filterInRadius.map((distance) => {
            return {
                thumbnailImageUrl: distance.image,
                imageBackgroundColor: "#FFFFFF",
                title: distance.name.replace(/(.{40})..+/, "$1…"),
                text: distance.distance,
                actions: [
                    {
                        type: "uri",
                        label: "เปิดแผนที่",
                        uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude}+${distance.longitude}`,
                    },
                ],
            };
        });
        const payload = {
            line: {
                type: "template",
                altText: "this is a carousel template",
                template: {
                    type: "carousel",
                    imageAspectRatio: "rectangle",
                    imageSize: "cover",
                    columns: columns,
                },
            },
        };
        console.log(JSON.stringify(payload));
        /** condition to check in radius 50 km and return it. **/
        if (filterInRadius.length === 0) {
            return agent.add("ไม่พบข้อมูล" + agent.intent + "ในระยะ(50km) ที่ต้องการ");
        }
        else {
            return agent.add(new dialogflow_fulfillment_1.Payload("LINE", JSON.parse(JSON.stringify(payload)), {
                rawPayload: true,
                sendAsMessage: true,
            }));
        }
    });
}
exports.getATMlocation = getATMlocation;
