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
require("dotenv/config");
const PORT = process.env.PORT;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize MikroORM
    const orm = yield postgresql_1.MikroORM.init(mikro_orm_config_1.default);
    // Run Migrations
    yield orm.getMigrator().up();
    // Initialize Express
    const app = (0, express_1.default)();
    // Initialize ApolloServer
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [resolvers_1.HelloResolver, resolvers_1.PostResolver, resolvers_1.UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em.fork() }), // Fork EntityManager for each request
    });
    // Start the Apollo Server
    yield apolloServer.start();
    // Apply middleware to Express
    apolloServer.applyMiddleware({ app }); // Creates GraphQL endpoint on Express
    // Start the Express server
    app.listen(PORT, () => {
        console.log("server started on localhost:4000");
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map