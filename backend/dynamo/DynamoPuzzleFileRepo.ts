import { IPuzzleFile, IPuzzleFileRepo } from "../core";

type DynamoPuzzle = {
  PK: string;
  SK: string;
  path: string;
};

export const DynamoPuzzleFileRepo: () => IPuzzleFileRepo = () => {
  return {
    get: async (puzzleId) => {
      const { Table, dynamoDb } = await init();
      const results = await dynamoDb
        .get({
          TableName: Table.Database.tableName,
          Key: {
            PK: `PUZZLE#${puzzleId}`,
            SK: `PUZZLE#${puzzleId}`,
          },
        })
        .promise();

      if (!results.Item) {
        return null;
      }

      return makePuzzle(results.Item as DynamoPuzzle);
    },
    put: async (puzzle) => {
      const { Table, dynamoDb } = await init();
      const dynamoPuzzle: DynamoPuzzle = {
        PK: `PUZZLE#${puzzle.id}`,
        SK: `PUZZLE#${puzzle.id}`,
        path: puzzle.path,
      };
      await dynamoDb
        .put({ TableName: Table.Database.tableName, Item: dynamoPuzzle })
        .promise();
    },
    find: async () => {
      const { Table, dynamoDb } = await init();
      const results = await dynamoDb
        .scan({
          TableName: Table.Database.tableName,
          FilterExpression: "begins_with(PK, :PK)",
          ExpressionAttributeValues: {
            ":PK": "PUZZLE#",
          },
        })
        .promise();

      const items = results.Items ?? [];

      return (items as DynamoPuzzle[]).map((item: DynamoPuzzle) =>
        makePuzzle(item)
      );
    },
  };
};

function makePuzzle(item: DynamoPuzzle): IPuzzleFile {
  return {
    id: item.PK.split("#")[1],
    path: item.path,
  };
}

async function init() {
  const { DynamoDB } = await import("aws-sdk");
  const { Table } = await import("@serverless-stack/node/table");
  const dynamoDb = new DynamoDB.DocumentClient();
  return { Table, dynamoDb };
}
