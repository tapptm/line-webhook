import { Payload, Text, Suggestion, Image, Card } from "dialogflow-fulfillment";
import pool from "../configs/connectiondb";

async function getGreeting(agent: { add: (arg0: string) => void }) {
  const client = await pool.connect();
  const sql = "SELECT * FROM travel";
  const { rows } = await client.query(sql);
  const todos = rows;
  client.release();

  console.log(todos);

  agent.add("Hello I am Webhook demo How are you...");
}

export { getGreeting };
