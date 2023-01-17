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
            /** format custom payload for line **/
            const contents = distanceData.map((distance) => {
                return {
                    type: "bubble",
                    size: "micro",
                    hero: {
                        type: "image",
                        url: distance.image,
                        size: "full",
                        aspectMode: "cover",
                        aspectRatio: "320:213",
                    },
                    body: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: distance.name.replace(/(.{40})..+/, "$1…"),
                                weight: "bold",
                                size: "sm",
                                wrap: true,
                            },
                            {
                                type: "box",
                                layout: "baseline",
                                contents: [
                                    {
                                        type: "icon",
                                        size: "xs",
                                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                                    },
                                    {
                                        type: "icon",
                                        size: "xs",
                                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                                    },
                                    {
                                        type: "icon",
                                        size: "xs",
                                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                                    },
                                    {
                                        type: "icon",
                                        size: "xs",
                                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                                    },
                                    {
                                        type: "icon",
                                        size: "xs",
                                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                                    },
                                    {
                                        type: "text",
                                        text: "4.0",
                                        size: "xs",
                                        color: "#8c8c8c",
                                        margin: "md",
                                    },
                                ],
                            },
                            {
                                type: "box",
                                layout: "vertical",
                                contents: [
                                    {
                                        type: "box",
                                        layout: "baseline",
                                        spacing: "sm",
                                        contents: [
                                            {
                                                type: "text",
                                                text: distance.distance,
                                                wrap: true,
                                                color: "#8c8c8c",
                                                size: "xs",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                        spacing: "sm",
                        paddingAll: "13px",
                    },
                    footer: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "separator",
                            },
                            {
                                type: "button",
                                action: {
                                    type: "uri",
                                    label: "เปิดแผนที่",
                                    uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude}+${distance.longitude}`,
                                },
                            },
                        ],
                    },
                };
            });
            const payload = {
                line: {
                    type: "flex",
                    altText: "Flex Message",
                    contents: {
                        type: "carousel",
                        contents: contents,
                    },
                },
            };
            console.log(JSON.stringify(payload));
            return agent.add(new dialogflow_fulfillment_1.Payload("LINE", JSON.parse(JSON.stringify(payload)), {
                rawPayload: true,
                sendAsMessage: true,
            }));
        }
        return agent.add("ไม่พบข้อมูล" + agent.intent + "ในระยะ (50km)");
    });
}
exports.getlocation = getlocation;
