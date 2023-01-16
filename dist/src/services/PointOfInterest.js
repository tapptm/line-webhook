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
function getPoiByGroup(intent) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectiondb_1.default.connect();
        const sql = `SELECT   community_id, 
                            poi_id, 
                            poi_name, 
                            poi_detail, 
                            poi_telephone, 
                            province_id, 
                            amphur_id, 
                            tambon_id, 
                            poi_website, 
                            poi_image_cover, 
                            poi_latitude, 
                            poi_longitude,  
                            poi_contanct_name, 
                            poi_contact_person_email, 
                            poi_contact_person_line, 
                            poi_contact_person_facebook, 
                            poi_contact_person_instagram, 
                            poi_contact_person_image, 
                            poi_name_en, poi_vdo, 
                            poi_detail_en, 
                            poi_address, 
                            role_name
                FROM poi 
                LEFT JOIN poi_group ON poi_group.poi_group_id = poi.poi_group_id
                WHERE poi_group.poi_group_name ='${intent}';`;
        const { rows } = yield client.query(sql);
        client.release();
        return rows;
    });
}
exports.getPoiByGroup = getPoiByGroup;
