import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from "@apollo/subgraph"
import cors from "cors"
import * as dotenv from "dotenv"
import express from "express"
import { readFileSync } from "fs"
import gql from "graphql-tag"
import resolvers from "./resolvers.ts"
import path from "path";
import { fileURLToPath } from "url";

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const typeDefs = gql(
  readFileSync(path.join(__dirname, "schema.graphql"), { encoding: "utf-8" })
)

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
})
await server.start()
app.use("/graphql", cors(), express.json(), expressMiddleware(server))

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})