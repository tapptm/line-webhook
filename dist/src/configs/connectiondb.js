"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = new pg_1.Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD + "",
    database: process.env.PG_DATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
});
