import {
  StackContext,
  WebSocketApi,
  use,
  Table,
} from "@serverless-stack/resources";
import { Database } from "./Database";

export function WebSocket({ stack }: StackContext) {
  const appTable = use(Database);

  const websocketConnectionsTable = new Table(stack, "WebsocketConnections", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const websocketApi = new WebSocketApi(stack, "websocket", {
    accessLog: false,
    defaults: {
      function: {
        bind: [appTable, websocketConnectionsTable],
      },
    },
    routes: {
      $connect: "functions/websocket/connect.handler",
      $disconnect: "functions/websocket/disconnect.handler",
      sendmessage: "functions/websocket/sendMessage.handler",
    },
  });

  stack.addOutputs({
    WebSocketApi: websocketApi.url,
  });

  return websocketApi;
}
