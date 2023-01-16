import { Payload, Text, Suggestion, Image, Card } from "dialogflow-fulfillment";
import pool from "../configs/connectiondb";

async function getATMlocation(agent: {
  intent: string;
  add: (arg0: string) => void;
}) {
  console.log(agent.intent);

  const client = await pool.connect();
  const sql = "SELECT * FROM poi_group;";
  const { rows } = await client.query(sql);
  const todos = rows;
  client.release();

  //   console.log(todos);

  agent.add("HERE! THIS IS YOUR PRODUCT.");
}

export { getATMlocation };
