import { App } from "@serverless-stack/resources";
import { Database } from "./Database";
import { GraphQL } from "./GraphQL";
import { PuzzleBucket } from "./PuzzleBucket";
import { Web } from "./Web";
import { WebSocket } from "./WebSocket";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm",
    },
  });
  app
    .stack(Database)
    .stack(PuzzleBucket)
    .stack(WebSocket)
    .stack(GraphQL)
    .stack(Web);
}
