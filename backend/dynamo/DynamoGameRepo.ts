import { IGame, IGameRepo, IPuzzle } from "../core";
import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";

type DynamoGame = {
  PK: string;
  SK: string;
  puzzle: IPuzzle;
};

type DynamoPlayer = {
  PK: string;
  SK: string;
  name: string;
};

type DynamoResultSet = [DynamoGame, ...DynamoPlayer[]];

export const DynamoGameRepo: () => IGameRepo = () => {
  const dynamoDb = new DynamoDB.DocumentClient();
  return {
    get: async (gameId) => {
      const results = await dynamoDb
        .query({
          TableName: Table.Database.tableName,
          KeyConditionExpression: "PK = :PK",
          ExpressionAttributeValues: {
            ":PK": `GAME#${gameId}`,
          },
        })
        .promise();

      if ((results.Items ?? []).length === 0) {
        return null;
      }

      const game = makeGame(results.Items as DynamoResultSet);

      return game;
    },
    put: async (game) => {
      const dynamoGame: DynamoGame = {
        PK: `GAME#${game.id}`,
        SK: `GAME#${game.id}`,
        puzzle: game.puzzle,
      };
      const dynamoPlayers = game.players.map((player) => ({
        PK: `GAME#${game.id}`,
        SK: `PLAYER#${player.id}`,
        name: player.name,
      }));
      await dynamoDb
        .batchWrite({
          RequestItems: {
            [Table.Database.tableName]: [
              {
                PutRequest: {
                  Item: dynamoGame,
                },
              },
              ...dynamoPlayers.map((player) => ({
                PutRequest: {
                  Item: player,
                },
              })),
            ],
          },
        })
        .promise();
    },
    find: async () => {
      const results = await dynamoDb
        .scan({
          TableName: Table.Database.tableName,
          FilterExpression: "begins_with(PK, :PK)",
          ExpressionAttributeValues: {
            ":PK": "GAME#",
          },
        })
        .promise();

      const items = results.Items ?? [];

      if (items.length === 0) {
        return [];
      }

      const resultSets = groupIntoDynamoResultSets(
        items as (DynamoGame | DynamoPlayer)[]
      );

      return resultSets.map((resultSet) => makeGame(resultSet));
    },
  };
};

function makeGame(items: DynamoResultSet): IGame {
  const [dynamoGame, ...dynamoPlayers] = items;
  return {
    id: dynamoGame.PK.split("#")[1],
    players: dynamoPlayers.map((player) => ({
      id: player.SK.split("#")[1],
      name: player.name,
    })),
    puzzle: dynamoGame.puzzle,
  };
}

function groupIntoDynamoResultSets(
  items: (DynamoGame | DynamoPlayer)[]
): DynamoResultSet[] {
  const resultSets: DynamoResultSet[] = [];
  const [firstItem, ...restOfItems] = items;
  let currentResultSet: DynamoResultSet = [firstItem as DynamoGame];
  for (const nextItem of restOfItems) {
    if (nextItem.PK === currentResultSet[0].PK) {
      currentResultSet.push(nextItem as DynamoPlayer);
    } else {
      resultSets.push(currentResultSet as DynamoResultSet);
      currentResultSet = [nextItem as DynamoGame];
    }
  }
  resultSets.push(currentResultSet);
  return resultSets;
}
