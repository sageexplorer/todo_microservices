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
   const dueDate = newTodo.dueDate
   const name = newTodo.name

  const newItem = await createNewData(todoId, userId, dueDate, name)
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
     },
    body: JSON.stringify({
      newTodo: newItem
    })
  }

}
async function createNewData(todoId: string, userId: string, dueDate: any, name: string ){

  const  newTodo = {
    todoId,
    userId,
    dueDate,
    name, 
    done: false 
  }

  await docClient
  .put({
    TableName: 'TodosTable',
    Item: newTodo
  })
  .promise()

 return newTodo 
}



