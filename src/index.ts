import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { userResolver } from "./graphQL/resolvers/userResolver";
import { createServer } from "http";
import cors from "cors";
(async () => {
  const app = express();
  app.use(cors());
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [userResolver] }),
    context: (context) => context,
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  app.get("/", (_, res) => {
    res.send("Hi im here");
  });
  const PORT = process.env.PORT || 5001;
  httpServer.listen(PORT, () => {
    console.log("Server up on port " + PORT);
  });
})();
