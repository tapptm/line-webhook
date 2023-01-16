import pool from "../configs/connectiondb";

async function getPoiByGroup(intent: String) {
  const client = await pool.connect();
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
  const { rows } = await client.query(sql);
  client.release();
  return rows;
}

export { getPoiByGroup };
