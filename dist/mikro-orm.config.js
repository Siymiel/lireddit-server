"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
exports.default = (0, postgresql_1.defineConfig)({
    entities: [Post_1.Post],
    dbName: 'lireddit',
    user: 'postgres',
    password: 'deepSpace10!#',
    port: 5432,
    debug: !constants_1.__prod__,
    driverOptions: { connection: { ssl: false } },
    migrations: {
        path: path_1.default.join(__dirname, './migrations'), // path to the folder with migrations
    },
});
//# sourceMappingURL=mikro-orm.config.js.map