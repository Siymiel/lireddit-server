"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const postgresql_1 = require("@mikro-orm/postgresql");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const resolvers_1 = require("./resolvers");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize MikroORM
    const orm = yield postgresql_1.MikroORM.init(mikro_orm_config_1.default);
    // Run Migrations
    yield orm.getMigrator().up();
    // Initialize Express
    const app = (0, express_1.default)();
    // app.use((_, res, next) => {
    //   res.setHeader("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    //   res.setHeader("Access-Control-Allow-Credentials", "true");
    //   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //   next();
    // });
    // Set up CORS middleware before any routes
    app.use((0, cors_1.default)({
        origin: "https://studio.apollographql.com", // Apollo Studio origin
        credentials: true, // Allow cookies to be sent with requests
    }));
    // Initialize redis client.
    let redisClient = (0, redis_1.createClient)();
    redisClient.connect().catch(console.error);
    // Initialize redis store.
    let redisStore = new connect_redis_1.default({
        client: redisClient,
        prefix: "liredditApp",
        disableTouch: true,
    });
    // Initialize express-session storage.
    app.use((0, express_session_1.default)({
        store: redisStore,
        name: "qid",
        resave: false,
        saveUninitialized: false,
        secret: "keyboardcat",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            secure: true,
            sameSite: "none", // csrf
        },
    }));
    // Initialize ApolloServer
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [resolvers_1.HelloResolver, resolvers_1.PostResolver, resolvers_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em.fork(), req, res }), // Fork EntityManager for each request
    });
    // Start the Apollo Server
    yield apolloServer.start();
    // Apply middleware to Express
    apolloServer.applyMiddleware({ app, cors: false }); // Creates GraphQL endpoint on Express
    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server started at: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map