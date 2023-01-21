import pool from "../configs/database";
import { imageUrl } from "../configs/urlpath";

async function getPoiByGroup(
  intent1: String,
  intent2: String,
  intent3: String
) {
  const client = await pool.connect();
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
  const { rows } = await client.query(sql);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/poi/${
          item.image
        }`
      : null;
  });

  return rows;
}

export { getPoiByGroup };
