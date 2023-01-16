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
                text: distance.name,
                title: distance.name,
                imageBackgroundColor: "#FFFFFF",
                thumbnailImageUrl: distance.image,
                actions: [
                    {
                        type: "postback",
                        uri: `#`,
                        label: "รายละเอียด",
                    },
                    {
                        label: "เปิดแผนที่",
                        uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude}+${distance.longitude}`,
                        type: "postback",
                    },
                ],
            };
        });
        const payload = {
            line: {
                type: "template",
                altText: "สถานที่และรายละเอียด",
                template: {
                    imageSize: "cover",
                    columns: columns,
                    imageAspectRatio: "rectangle",
                    type: "carousel",
                },
            },
        };
        return agent.add(new dialogflow_fulfillment_1.Payload(agent.UNSPECIFIED, payload, {
            rawPayload: true,
            sendAsMessage: true,
        }));
    });
}
exports.getATMlocation = getATMlocation;
