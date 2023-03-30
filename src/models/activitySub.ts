import { type } from "os";
import pool from "../configs/database";
import { IMAGE_URL } from "../configs/urlpath";

async function getActivitysubTH(point_id: any) {
  const client = await pool.connect();
  const sql = `SELECT activity_sub.activity_sub_name as name, 
                      sound_webhook.id as point,
                      activity_sub.activity_sub_detail as detail, 
                      activity_sub.activity_sub_latitude as latitude, 
                      activity_sub.activity_sub_longitude as longitude, 
                      activity_sub.activity_sub_image as image,
                      sound_webhook.filename_th as soundname,
                      activity.community_id
              FROM activity_sub
              LEFT JOIN activity on activity.activity_id = activity_sub.activity_id
              LEFT JOIN sound_webhook ON sound_webhook.activity_sub_id = activity_sub.activity_sub_id
              WHERE activity_sub.activity_id = 323
              AND  sound_webhook.id = ?;
              `;
  const { rows } = await client.query(sql, [
    typeof point_id === "number" ? point_id : "sound_webhook.id",
  ]);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${IMAGE_URL}/community/${parseInt(item.community_id)}/activity/${
          item.image
        }`
      : null;
  });

  return rows;
}

async function getActivitysubEN(point_id:any) {
  const client = await pool.connect();
  const sql = `SELECT activity_sub.activity_sub_name_en as name, 
                      sound_webhook.id as point,
                      activity_sub.activity_sub_detail_en as detail, 
                      activity_sub.activity_sub_latitude as latitude, 
                      activity_sub.activity_sub_longitude as longitude, 
                      activity_sub.activity_sub_image as image,
                      sound_webhook.filename_en as soundname,
                      activity.community_id
              FROM public.activity_sub
              LEFT JOIN activity on activity.activity_id = activity_sub.activity_id
              LEFT JOIN sound_webhook ON sound_webhook.activity_sub_id = activity_sub.activity_sub_id
              WHERE activity_sub.activity_id = 323
              AND  sound_webhook.id = ?;
              `;
  const { rows } = await client.query(sql, [
    typeof point_id === "number" ? point_id : "sound_webhook.id",
  ]);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${IMAGE_URL}/community/${parseInt(item.community_id)}/activity/${
          item.image
        }`
      : null;
  });

  return rows;
}
export { getActivitysubTH, getActivitysubEN };
