import 'source-map-support/register'
import * as AWS from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const todoId = event.pathParameters.todoId

    const name = updatedTodo["name"]
    const dueDate  = updatedTodo["dueDate"]
    const done = updatedTodo["done"]
    
  
    const result = await docClient.update({
     TableName: 'TodosTable',
     Key: {
        "name": name,
        "dueDate": dueDate
    },
    UpdateExpression:  "set done = :d",
    ExpressionAttributeValues:{
       ":d": done,
   
   },
       
   }).promise()

  const items = await result 
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
     items: items 
    })
  }

}
