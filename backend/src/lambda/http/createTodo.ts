import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId} from '../utils'
import { s3KeyNormalizer } from 'middy/middlewares';

const docClient = new AWS.DynamoDB.DocumentClient()
const uuidv1 = require('uuid/v1');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

   const todoId = uuidv1()
   const userId = getUserId(event)
   const dueDate = newTodo.dueDate
   const name = newTodo.name
   const attachmentUrl = `${s3_bucket_name}.s3.amazonaws.com/${todoId}`

  

  const newItem = await createNewTodo(todoId, userId, dueDate, name, attachmentUrl)
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

async function createNewTodo(todoId: string, userId: string, dueDate: any, name: string, attachmentUrl:string){

  
  const  newTodo = {
    todoId,
    userId,
    createdAt: new Date().toISOString(), 
    dueDate,
    name, 
    done: false,
    attachmentUrl
  }

  await docClient
  .put({
    TableName: 'TodosTable',
    Item: newTodo
  })
  .promise()

 return newTodo 
}
