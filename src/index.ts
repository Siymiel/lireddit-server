import "reflect-metadata";
import { MikroORM } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver, HelloResolver, UserResolver } from "./resolvers";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import "dotenv/config";
import { MyContext } from "./types";
import cors from "cors";

const PORT = process.env.PORT;

const main = async () => {
  // Initialize MikroORM
  const orm = await MikroORM.init(mikroOrmConfig);

  // Run Migrations
  await orm.getMigrator().up();

  // Initialize Express
  const app = express();

  // Set up CORS middleware before any routes
  app.use(
    cors({
      origin: "https://studio.apollographql.com", // Apollo Studio origin
      credentials: true, // Allow cookies to be sent with requests
    })
  );

  app.use((_, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' app.satismeter.com"
    );
    next();
  });

  // Initialize redis client.
  let redisClient = createClient();
  redisClient.connect().catch(console.error);

  // Initialize redis store.
  let redisStore: session.Store = new (RedisStore as any)({
    client: redisClient,
    prefix: "liredditApp",
    disableTouch: true,
  });

  // Initialize express-session storage.
  app.use(
    session({
      store: redisStore,
      name: "qid",
      resave: false,
      saveUninitialized: false,
      secret: "keyboardcat",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: true,
        sameSite: "none" // "none" for cross-site requests in prod, "lax" for development
      },
    })
  );

  // Initialize ApolloServer
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em.fork(), req, res }), // Fork EntityManager for each request
  });

  // Start the Apollo Server
  await apolloServer.start();

  // Apply middleware to Express
  apolloServer.applyMiddleware({ app, cors: false }); // Creates GraphQL endpoint on Express

  // Start the Express server
  app.listen(PORT, () => {
    console.log(
      `Server started at: http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

main().catch((err) => console.log(err));
