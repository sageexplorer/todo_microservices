import 'source-map-support/register'
import * as AWS from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const parseBody = (event["queryStringParameters"])

  var dd = parseBody["dueDate"].toLowerCase() == 'true' ? true : false;   //change to boolean 
  var params = {
    TableName: 'TodosTable',
    key: {
      "name": parseBody["name"],
      "dueDate": dd,
      },
    UpdateExpression:  "set done = :d",
    ExpressionAttributeValues:{
      ":d":dd,
  },
   ReturnValues:"UPDATED_NEW"
  }

  await docClient.put({
    TableName: 'TodosTable',
    Item: params
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
     params 
    })
  }

}
