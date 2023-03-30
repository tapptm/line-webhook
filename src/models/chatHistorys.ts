import pool from "../configs/database";

async function saveChats(userId: String, Intent: String, message: string) {
  try {
    const client = await pool.connect();
    const sql = `INSERT INTO baipho_chatbot( user_id, intent_name, created_date, created_by, messages)
                VALUES ($1, $2, $3, $4, $5)`;
    const { rows } = await client.query(sql, [
      userId,
      Intent,
      new Date(),
      "bots",
      message,
    ]);
    client.release();
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function saveLocation(
  userId: String,
  latitude: number,
  longitude: number
) {
  try {
    const client = await pool.connect();
    const sql = `INSERT INTO baipho_chatbot( user_id, intent_name, created_date, created_by, messages,latitude,longitude)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const { rows } = await client.query(sql, [
      userId,
      "Location",
      new Date(),
      "bots",
      "Location",
      latitude,
      longitude,
    ]);
    client.release();
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function getLocation(userId: String) {
  const client = await pool.connect();
  const sql = ` SELECT * 
                      FROM baipho_chatbot 
                      WHERE user_id = '${userId}' 
                      AND latitude is not null  
                      AND longitude is not null  
                      AND created_date AT TIME ZONE 'Asia/Bangkok' >= (NOW() - INTERVAL '5 minutes')::timestamp with time zone
                    order by id DESC 
                    LIMIT 1
              `;
  const { rows } = await client.query(sql);
  client.release();
  return rows;
}
async function getChats(userId: String) {
  const client = await pool.connect();
  const sql = ` SELECT * 
                FROM baipho_chatbot 
                WHERE user_id = '${userId}' 
                AND (intent_name = 'language_english' OR intent_name = 'language_thai')
                AND created_date AT TIME ZONE 'Asia/Bangkok' >= (NOW() - INTERVAL '5 minutes')::timestamp with time zone;
              `;
  const { rows } = await client.query(sql);
  client.release();
  return rows;
}

export { saveChats, getChats, saveLocation ,getLocation};
