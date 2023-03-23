import dialogflow from "@google-cloud/dialogflow";
import dotenv from "dotenv";
dotenv.config();

const EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PROJECT_ID = process.env.PROJECT_ID + "";
const SESSION_ID = process.env.SESSION_ID + "";

const credts = {
  credentials: {
    client_email: EMAIL,
    private_key: PRIVATE_KEY,
  },
};

const sessionClient = new dialogflow.SessionsClient(credts);
const sessionPath = sessionClient.projectAgentSessionPath(
  PROJECT_ID,
  SESSION_ID
);

export { sessionClient, sessionPath };
