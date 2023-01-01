import { use, StackContext, StaticSite } from "@serverless-stack/resources";
import { GraphQL } from "./GraphQL";
import { WebSocket } from "./WebSocket";

export function Web({ stack }: StackContext) {
  const graphqlApi = use(GraphQL);
  const websocketApi = use(WebSocket);

  const site = new StaticSite(stack, "SvelteSite", {
    path: "web",
    buildCommand: "yarn run build",
    buildOutput: "dist",
    environment: {
      VITE_GRAPHQL_URL: graphqlApi.url + "/graphql",
      VITE_WEBSOCKET_URL: websocketApi.url,
    },
  });

  stack.addOutputs({
    url: site.url,
  });
}
