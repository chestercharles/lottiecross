import { ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse(event.body!).data;
  const { stage, domainName } = event.requestContext;

  const apiG = new ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

  const postToConnection = async function (id: string) {
    try {
      await apiG
        .postToConnection({ ConnectionId: id, Data: messageData })
        .promise();
    } catch (e: any) {
      if (e.statusCode === 410) {
        // Remove stale connections
        // await dynamoDb.delete({ TableName, Key: { id } }).promise();
      }
    }
  };

  // await Promise.all(
  //   allConnections.Items!.map((item) => postToConnection(item.id))
  // );

  return { statusCode: 200, body: "Message sent" };
};
