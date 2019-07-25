import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import * as AWSXRay from 'aws-xray-sdk'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const XAWS = AWSXRay.captureAWS(AWS)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
 

  const imageId = uuid.v4()
  const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
  const url = s3.getSignedUrl('putObject', {
    Bucket: 'serverlesstodoapp',
    Key: todoId,
    ContentType: 'image/png',
    Expires: 30000
  })

  console.log("MY SIGNED URL IS", url)
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
     },
    body: JSON.stringify({
      uploadUrl: url
    })
  }

   
}
