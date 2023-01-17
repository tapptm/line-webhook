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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoiByGroup = void 0;
const connectiondb_1 = __importDefault(require("../configs/connectiondb"));
function getPoiByGroup(intent1, intent2, intent3) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectiondb_1.default.connect();
        const sql = `SELECT   community_id, 
                        poi_id as poiid, 
                        poi_name as name, 
                        poi_detail as detail, 
                        poi_telephone as tel,
                        poi_website as website, 
                        poi_image_cover as image, 
                        poi_latitude as latitude, 
                        poi_longitude as longitude  
                FROM poi 
                LEFT JOIN poi_group ON poi_group.poi_group_id = poi.poi_group_id
                WHERE poi_group.poi_group_name ='${intent1}'
                OR poi_group.poi_group_name ='${intent2}'
                OR poi_group.poi_group_name ='${intent3}';`;
        const { rows } = yield client.query(sql);
        client.release();
        return rows;
    });
}
exports.getPoiByGroup = getPoiByGroup;
