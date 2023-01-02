import { ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { IPlayerService } from "../core";

export const WebsocketPlayerService: (
  event: APIGatewayProxyEvent
) => IPlayerService = (event) => {
  const apiG = new ApiGatewayManagementApi({
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  return {
    sendGameUpdate: async (playerId, game) => {
      try {
        await apiG
          .postToConnection({
            ConnectionId: playerId,
            Data: JSON.stringify({ game }),
          })
          .promise();
      } catch (e: any) {
        const playerHasDisconnectedError = e.statusCode === 410;
        if (!playerHasDisconnectedError) {
          throw e;
        }
      }
    },
    isPlayerStillConnected: async (playerId) => {
      try {
        const result = await apiG
          .getConnection({ ConnectionId: playerId })
          .promise();
        console.log("got result", result.Identity);
        return true;
      } catch (e: any) {
        const playerHasDisconnectedError = e.statusCode === 410;
        if (playerHasDisconnectedError) {
          console.log("got result", playerId, "has disconnected");
          return false;
        }
        throw e;
      }
    },
  };
};
