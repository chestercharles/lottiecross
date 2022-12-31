import {
  use,
  StackContext,
  Api as ApiGateway,
} from "@serverless-stack/resources";
import { Database } from "./Database";

export function GraphQL({ stack }: StackContext) {
  const table = use(Database);

  const graphqlApi = new ApiGateway(stack, "graphql", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "POST /graphql": {
        type: "graphql",
        function: {
          handler: "functions/graphql/server.handler",
        },
      },
    },
  });

  stack.addOutputs({
    GraphQlApi: graphqlApi.url,
  });

  return graphqlApi;
}
