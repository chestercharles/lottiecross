import { StackContext, WebSocketApi, use } from "@serverless-stack/resources";
import { Database } from "./Database";
import { PuzzleBucket } from "./PuzzleBucket";

export function WebSocket({ stack }: StackContext) {
  const database = use(Database);
  const puzzleBucket = use(PuzzleBucket);

  const websocketApi = new WebSocketApi(stack, "websocket", {
    accessLog: false,
    defaults: {
      function: {
        bind: [database, puzzleBucket],
      },
    },
    routes: {
      $connect: "functions/websocket/connect.handler",
      $disconnect: "functions/websocket/disconnect.handler",
      sendmessage: "functions/websocket/sendMessage.handler",
    },
  });

  stack.addOutputs({
    url: websocketApi.url,
  });

  return websocketApi;
}
