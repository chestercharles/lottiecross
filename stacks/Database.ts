import { StackContext, Table } from "@serverless-stack/resources";

export function Database({ stack }: StackContext) {
  const database = new Table(stack, "Database", {
    fields: {
      PK: "string",
      SK: "string",
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
  });

  return database;
}
