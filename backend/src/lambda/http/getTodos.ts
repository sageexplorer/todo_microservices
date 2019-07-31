import "source-map-support/register";
import * as AWS from "aws-sdk";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from "aws-lambda";
import { JsonWebTokenError } from "jsonwebtoken";
import { getUserId } from "../utils";

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const items = await getTodo(userId);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items: items.Items
    })
  };
};

async function getTodo(userId: string) {
  const result = await docClient
    .query({
      TableName: "TodosTable",
      IndexName: "userid",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    })
    .promise();

  return result;
}
