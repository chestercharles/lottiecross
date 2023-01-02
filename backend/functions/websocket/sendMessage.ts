import { APIGatewayProxyHandler } from "aws-lambda";
import {
  IGame,
  RemoveDisconnectedPlayers,
  SendGameUpdate,
  UpdateGamePuzzleState,
} from "core";
import { DynamoGameRepo } from "dynamo";
import { WebsocketPlayerService } from "websocket";

export const handler: APIGatewayProxyHandler = async (event) => {
  const messageData: {
    gameId: string;
    newState: string;
  } = JSON.parse(event.body!).data;

  await RemoveDisconnectedPlayers({
    playerService: WebsocketPlayerService(event),
    gameRepo: DynamoGameRepo(),
  })({ gameId: messageData.gameId });

  await UpdateGamePuzzleState({
    gameRepo: DynamoGameRepo(),
  })({ gameId: messageData.gameId, newState: messageData.newState });

  await SendGameUpdate({
    playerService: WebsocketPlayerService(event),
    gameRepo: DynamoGameRepo(),
  })({ gameId: messageData.gameId });

  return { statusCode: 200, body: "Message sent" };
};
