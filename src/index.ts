import "reflect-metadata";
import { MikroORM } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  // Initialize MikroORM
  const orm = await MikroORM.init(mikroOrmConfig);

  // Run Migrations
  await orm.getMigrator().up();

  // Initialize Express
  const app = express();

  // Initialize ApolloServer
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em.fork() }), // Fork EntityManager for each request
  });

  // Start the Apollo Server
  await apolloServer.start();

  // Apply middleware to Express
  apolloServer.applyMiddleware({ app }); // Creates GraphQL endpoint on Express

  // Start the Express server
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => console.log(err));
