import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { JsonWebTokenError } from 'jsonwebtoken';
import {getUserId} from '../utils'


const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const result = await docClient.query({
    TableName: 'TodosTable',
    IndexName: 'userid',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
  }
  }).promise()
  const items = await result.Items
  //const newitems = await items.filter(i => i.userId == getUserId)
  console.log(event)
  console.log("MY USER ID IS", userId)
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
