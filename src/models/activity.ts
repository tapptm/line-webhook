import pool from "../configs/database";
import { imageUrl } from "../configs/urlpath";

async function getActivity() {
  const client = await pool.connect();
  const sql = `SELECT activity_name as name, 
                      activity_detail as detail,
                      activity_latitude as latitude,
                      activity_longitude as longitude,
                      activity_image_cover as image,
                      community_id
              FROM activity;`;
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

  console.log("ACTIVITY_DATA", rows);
  

  return rows;
}

async function getActivitysubTH() {
  try {
    const client = await pool.connect();
    const sql = `SELECT activity_sub.activity_sub_name as name, 
                        activity_sub.activity_sub_detail as detail, 
                        activity_sub.activity_sub_latitude as latitude, 
                        activity_sub.activity_sub_longitude as longitude, 
                        activity_sub.activity_sub_image as image,
                        activity.community_id
              FROM public.activity_sub
              LEFT JOIN activity on activity.activity_id = activity_sub.activity_id
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
  } catch (error) {
    console.log(error);
  }
}

async function getActivitysubEN() {
  const client = await pool.connect();
  const sql = `SELECT activity.community_id,
                      activity_sub.activity_sub_name_en as name, 
                      activity_sub.activity_sub_detail_en as detail, 
                      activity_sub.activity_sub_latitude as latitude, 
                      activity_sub.activity_sub_longitude as longitude, 
                      activity_sub.activity_sub_image as image
              FROM public.activity_sub
              LEFT JOIN activity on activity.activity_id = activity_sub.activity_id
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
export { getActivity, getActivitysubTH, getActivitysubEN };
