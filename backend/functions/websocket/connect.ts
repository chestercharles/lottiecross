import { APIGatewayProxyHandler } from "aws-lambda";
import { JoinGame, RemoveDisconnectedPlayers, SendGameUpdate } from "core";
import { DynamoGameRepo } from "dynamo";
import { WebsocketPlayerService } from "websocket";

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

  await RemoveDisconnectedPlayers({
    playerService: WebsocketPlayerService(event),
    gameRepo: DynamoGameRepo(),
  })({ gameId });

  await JoinGame({ gameRepo: DynamoGameRepo() })({
    gameId,
    playerName,
    playerId,
  });

  await SendGameUpdate({
    playerService: WebsocketPlayerService(event),
    gameRepo: DynamoGameRepo(),
  })({ gameId });

  const game = await DynamoGameRepo().get(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  return { statusCode: 200, body: JSON.stringify(game) };
};
