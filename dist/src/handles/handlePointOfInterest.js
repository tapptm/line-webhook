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
const urlpath_1 = require("../configs/urlpath");
function calculateDistance(intent, latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        const poidata = yield (0, PointOfInterest_1.getPoiByGroup)(intent);
        const distancePointofinterest = poidata.map((item) => {
            item.latitude = parseFloat(item.latitude);
            item.longitude = parseFloat(item.longitude);
            item.image = item.image
                ? `${urlpath_1.imageUrl}/community/${parseInt(item.community_id)}/poi/${item.image}`
                : null;
            return Object.assign(Object.assign({}, item), { distance: (0, geolib_1.getDistance)({ latitude: latitude, longitude: longitude }, { latitude: item.latitude, longitude: item.longitude }) /
                    1000 +
                    " Km" });
        });
        const volunteers = (0, geolib_1.orderByDistance)({ latitude: latitude, longitude: longitude }, distancePointofinterest);
        return volunteers;
    });
}
function getATMlocation(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        const distanceData = yield calculateDistance(agent.intent, 14.9881753, 102.1198264);
        const columns = distanceData.map((distance) => {
            return {
                thumbnailImageUrl: distance.image,
                imageBackgroundColor: "#FFFFFF",
                title: distance.name,
                text: distance.name,
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
        const payloads = {
            line: {
                type: "template",
                altText: "this is a carousel template",
                template: {
                    type: "carousel",
                    imageAspectRatio: "rectangle",
                    imageSize: "cover",
                    columns: [
                        {
                            thumbnailImageUrl: "https://admin.trinitytrip.com/uploads/community/1/poi/poi_081d05881d24d2c0e2e6e83b500d231f_20211012034959000000.jpg",
                            imageBackgroundColor: "#FFFFFF",
                            title: "ห้ะ",
                            text: "ห้ะ",
                            actions: [
                                {
                                    type: "uri",
                                    label: "รายละเอียด",
                                    uri: "https://www.google.com/",
                                },
                            ],
                        },
                    ],
                },
            },
        };
        console.log(JSON.stringify(payload, null, 4));
        console.log(columns);
        console.log(payloads);
        const a = {
            line: {
                type: "template",
                altText: "this is a carousel template",
                template: {
                    type: "carousel",
                    imageAspectRatio: "rectangle",
                    imageSize: "cover",
                    columns: [
                        {
                            thumbnailImageUrl: "https://admin.trinitytrip.com/uploads/community/6/poi/poi_cd8b791439946d1d49d83082c513eb19_20211123072827000000.jpg",
                            imageBackgroundColor: "#FFFFFF",
                            title: "บ้านหนองพุก ต.หนองบัว อ.ศีขรภูมิ จ.สุรินทร์",
                            text: "บ้านหนองพุก ต.หนองบัว อ.ศีขรภูมิ จ.สุรินทร์",
                            actions: [
                                {
                                    type: "uri",
                                    label: "เปิดแผนที่",
                                    uri: "http://maps.google.com/maps?z=12&t=m&q=loc:15.0771929+103.76335114",
                                },
                            ],
                        },
                        {
                            thumbnailImageUrl: "https://admin.trinitytrip.com/uploads/community/10/poi/poi_e962f83a5cc3dedb252a249ae4795aaf_20211125043844000000.jpg",
                            imageBackgroundColor: "#FFFFFF",
                            title: "ATM ธนาคารกรุงไทย บจก.เอส วรรณ ซัพพลายส์ ศูนย์กระจายสินค้า จ.สุรินทร์",
                            text: "ATM ธนาคารกรุงไทย บจก.เอส วรรณ ซัพพลายส์ ศูนย์กระจายสินค้า จ.สุรินทร์",
                            actions: [
                                {
                                    type: "uri",
                                    label: "เปิดแผนที่",
                                    uri: "http://maps.google.com/maps?z=12&t=m&q=loc:14.92958496+103.77651798",
                                },
                            ],
                        }
                    ],
                },
            },
        };
        return agent.add(new dialogflow_fulfillment_1.Payload("LINE", payloads, {
            rawPayload: true,
            sendAsMessage: true,
        }));
    });
}
exports.getATMlocation = getATMlocation;
