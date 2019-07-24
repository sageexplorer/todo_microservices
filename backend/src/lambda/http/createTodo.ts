import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId} from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const uuidv1 = require('uuid/v1');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  console.log('MY TO DO IS', newTodo.name)
 
  

  const todoId = uuidv1()
  const userId = getUserId(event)

  const newItem = {
    userId,
    todoId,
    dueDate: newTodo.dueDate,
    name: newTodo.name,

    ...newTodo
  }

  // TODO: Implement creating a new TODO item
  await docClient.put({
    TableName: 'TodosTable',
    Item: newItem
  }).promise()


  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
     },
    body: JSON.stringify({
     newItem
    })
  }

}
