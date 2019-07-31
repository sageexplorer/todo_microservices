import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const items = await deleteTodo(todoId);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items
    })
  };
};

async function deleteTodo(todoId: string) {
  const new_result = await docClient
    .query({
      TableName: "TodosTable",
      IndexName: "todoid",
      KeyConditionExpression: "todoId = :todoId",
      ExpressionAttributeValues: {
        ":todoId": todoId
      }
    })
    .promise();

  const items = await new_result.Items;
  const name = items[0].name;
  const due = items[0].dueDate;

  const result = await docClient
    .delete({
      TableName: "TodosTable",
      Key: {
        name: name,
        dueDate: due
      }
    })
    .promise();

  return result;
}
