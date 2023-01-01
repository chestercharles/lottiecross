import {
  use,
  StackContext,
  Api as ApiGateway,
} from "@serverless-stack/resources";
import { Database } from "./Database";
import { PuzzleBucket } from "./PuzzleBucket";

export function GraphQL({ stack }: StackContext) {
  const table = use(Database);
  const puzzleBucket = use(PuzzleBucket);

  const graphqlApi = new ApiGateway(stack, "graphql", {
    defaults: {
      function: {
        bind: [table, puzzleBucket],
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
    url: graphqlApi.url,
  });

  return graphqlApi;
}
