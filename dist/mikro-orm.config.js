"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const constants_1 = require("./constants");
const entities_1 = require("./entities");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
exports.default = (0, postgresql_1.defineConfig)({
    entities: [entities_1.Post, entities_1.User],
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    debug: !constants_1.__prod__,
    driverOptions: { connection: { ssl: false } },
    migrations: {
        path: path_1.default.join(__dirname, './migrations'), // path to the folder with migrations
    },
});
//# sourceMappingURL=mikro-orm.config.js.map