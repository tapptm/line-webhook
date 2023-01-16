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
const PointOfInterest_1 = require("../services/PointOfInterest");
const geolib_1 = require("geolib");
function getATMlocation(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        const poi = yield (0, PointOfInterest_1.getPoiByGroup)(agent.intent);
        const volunteers = (0, geolib_1.orderByDistance)({ latitude: 14.9881753, longitude: 102.1198264 }, poi);
        console.log(volunteers);
        const payload = {
            line: {
                type: "template",
                altText: "this is a carousel template",
                template: {
                    imageSize: "cover",
                    columns: [
                        {
                            actions: [
                                {
                                    label: "สั่งซื้อ",
                                    data: "action=buy&itemid=111",
                                    type: "postback",
                                },
                                {
                                    label: "เพิ่มลงรถเข็น",
                                    type: "postback",
                                    data: "action=add&itemid=111",
                                },
                                {
                                    type: "uri",
                                    label: "รายละเอียด",
                                    uri: "https://www.google.com/",
                                },
                            ],
                            title: "แผ่นเกม Sword Art Online",
                            thumbnailImageUrl: "https://1.bp.blogspot.com/-U90M8DyKu7Q/W9EtONMCf6I/AAAAAAAAW_4/7L_jB_Rg9oweu2HKhULNdu9WNefw9zf9wCLcBGAs/s1600/sao-full.jpg",
                            text: "แผ่นเกม Sword Art Online",
                            imageBackgroundColor: "#FFFFFF",
                            defaultAction: {
                                label: "รายละเอียด",
                                type: "uri",
                                uri: "https://www.google.com/",
                            },
                        },
                        {
                            thumbnailImageUrl: "https://2.bp.blogspot.com/-xAUbzdD07Z8/W9F4070M0JI/AAAAAAAAXAE/67QhUZB4TI4Xyu3GT2-DO0yA5XJtlij-ACLcBGAs/s1600/sao-os.jpg",
                            text: "Sword Art Online Ordinal Scale",
                            imageBackgroundColor: "#FFFFFF",
                            defaultAction: {
                                uri: "https://www.google.com/",
                                label: "รายละเอียด",
                                type: "uri",
                            },
                            title: "Sword Art Online Ordinal Scale",
                            actions: [
                                {
                                    type: "postback",
                                    data: "action=buy&itemid=111",
                                    label: "สั่งซื้อ",
                                },
                                {
                                    label: "เพิ่มลงรถเข็น",
                                    data: "action=add&itemid=111",
                                    type: "postback",
                                },
                                {
                                    type: "uri",
                                    label: "รายละเอียด",
                                    uri: "https://www.google.com/",
                                },
                            ],
                        },
                    ],
                    imageAspectRatio: "rectangle",
                    type: "carousel",
                },
            },
        };
        agent.add(new dialogflow_fulfillment_1.Payload(agent.UNSPECIFIED, payload, {
            rawPayload: true,
            sendAsMessage: true,
        }));
    });
}
exports.getATMlocation = getATMlocation;
