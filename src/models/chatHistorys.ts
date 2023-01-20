import pool from "../configs/database";

async function saveChats(userId: String, Intent: String, message: string) {
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
}

async function getChats(userId: String) {
  const client = await pool.connect();
  const sql = `SELECT * FROM baipho_chatbot WHERE user_id = '${userId}';`;
  const { rows } = await client.query(sql);
  client.release();
  return rows;
}

export { saveChats, getChats };
