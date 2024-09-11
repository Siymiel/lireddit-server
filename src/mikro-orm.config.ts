import { defineConfig } from '@mikro-orm/postgresql';
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";

export default defineConfig({
    entities: [Post],
    dbName: 'lireddit',
    user: 'postgres',
    password: 'deepSpace10!#',
    port: 5432,
    debug: !__prod__,
    driverOptions: { connection: { ssl: false } }, 
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
    },
});