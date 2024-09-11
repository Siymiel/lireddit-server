import { defineConfig } from '@mikro-orm/postgresql';
import { __prod__ } from "./constants";
import { Post, User } from "./entities";
import path from "path";

import "dotenv/config"

export default defineConfig({
    entities: [Post, User],
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    debug: !__prod__,
    driverOptions: { connection: { ssl: false } }, 
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
    },
});