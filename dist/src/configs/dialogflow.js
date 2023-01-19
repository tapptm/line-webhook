"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionPath = exports.sessionClient = void 0;
const dialogflow_1 = __importDefault(require("@google-cloud/dialogflow"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const sessionClient = new dialogflow_1.default.SessionsClient(credts);
exports.sessionClient = sessionClient;
const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, SESSION_ID);
exports.sessionPath = sessionPath;
