import "source-map-support/register";
import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  const name = updatedTodo["name"];
  const dueDate = updatedTodo["dueDate"];
  const done = updatedTodo["done"];

  const items = await updateTodo(name, dueDate, done);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items: items
    })
  };
};
async function updateTodo(name: string, dueDate: string, done: boolean) {
  const result = await docClient
    .update({
      TableName: "TodosTable",
      Key: {
        name: name,
        dueDate: dueDate
      },
      UpdateExpression: "set done = :d",
      ExpressionAttributeValues: {
        ":d": done
      }
    })
    .promise();
  return result;
}

