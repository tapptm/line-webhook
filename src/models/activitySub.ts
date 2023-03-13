import pool from "../configs/database";
import { imageUrl } from "../configs/urlpath";

async function getActivitysubTH() {
  const client = await pool.connect();
  const sql = `SELECT activity_sub.activity_sub_name as name, 
                      activity_sub.activity_sub_detail as detail, 
                      activity_sub.activity_sub_latitude as latitude, 
                      activity_sub.activity_sub_longitude as longitude, 
                      activity_sub.activity_sub_image as image,
                      sound_webhook.filename_th as soundname,
                      activity.community_id
              FROM activity_sub
              LEFT JOIN activity on activity.activity_id = activity_sub.activity_id
              LEFT JOIN sound_webhook ON sound_webhook.activity_sub_id = activity_sub.activity_sub_id
              ;`;
  const { rows } = await client.query(sql);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/27/activity/${item.image}`
      : null;
  });

  return rows;
}

async function getActivitysubEN() {
  const client = await pool.connect();
  const sql = `SELECT activity_sub.activity_sub_name_en as name, 
                      activity_sub.activity_sub_detail_en as detail, 
                      activity_sub.activity_sub_latitude as latitude, 
                      activity_sub.activity_sub_longitude as longitude, 
                      activity_sub.activity_sub_image as image,
                      sound_webhook.filename_th as soundname,
                      activity.community_id
              FROM public.activity_sub
              LEFT JOIN activity on activity.activity_id = activity_sub.activity_id
              LEFT JOIN sound_webhook ON sound_webhook.activity_sub_id = activity_sub.activity_sub_id
              ;`;
  const { rows } = await client.query(sql);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/activity/${
          item.image
        }`
      : null;
  });

  return rows;
}
export { getActivitysubTH, getActivitysubEN };
