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
exports.calculateDistance = void 0;
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
            const distance = (0, geolib_1.getDistance)({ latitude: latitude, longitude: longitude }, { latitude: item.latitude, longitude: item.longitude });
            return Object.assign(Object.assign({}, item), { distance: distance >= 1000
                    ? `(${(distance / 1000).toFixed(2)} กิโลเมตร)`
                    : `(${distance.toFixed(0)} เมตร)`, distance_meters: distance });
        });
        /** order by and filter radius in 100 km **/
        const volunteers = (0, geolib_1.orderByDistance)({ latitude: latitude, longitude: longitude }, distancePointofinterest)
            .filter((item) => item.distance_meters <= 100000 // meters
        )
            .slice(0, 3);
        return volunteers;
    });
}
exports.calculateDistance = calculateDistance;
