import { APIGatewayProxyHandler } from "aws-lambda";
import { LeaveGame } from "core";
import { DynamoGameRepo } from "dynamo";

export const handler: APIGatewayProxyHandler = async (event) => {
  const playerId = event.requestContext.connectionId;
  if (!playerId) {
    return { statusCode: 400, body: "Missing connection Id" };
  }

  const gameId = event.queryStringParameters?.gameId;
  if (!gameId) {
    return { statusCode: 400, body: "Missing gameId" };
  }

  await LeaveGame({ gameRepo: DynamoGameRepo() })({
    gameId,
    playerId,
  });

  return { statusCode: 200, body: "Disconnected" };
};
