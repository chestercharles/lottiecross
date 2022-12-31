import { APIGatewayProxyHandler } from "aws-lambda";
import { JoinGame } from "core";
import { DynamoGameRepo } from "dynamo";

export const handler: APIGatewayProxyHandler = async (event) => {
  const playerId = event.requestContext.connectionId;
  if (!playerId) {
    return { statusCode: 400, body: "Missing connection Id" };
  }

  const playerName = event.queryStringParameters?.playerName;
  if (!playerName) {
    return { statusCode: 400, body: "Missing playerName" };
  }

  const gameId = event.queryStringParameters?.gameId;
  if (!gameId) {
    return { statusCode: 400, body: "Missing gameId" };
  }

  await JoinGame({ gameRepo: DynamoGameRepo() })({
    gameId,
    playerName,
    playerId,
  });

  return { statusCode: 200, body: "Connected" };
};
