import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()

const connectionsTable = process.env.CONNECTIONS_TABLE
const logger = createLogger('websocket')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Websocket Event: ', event)

  const connectionId = event.requestContext.connectionId
  const userId = event.queryStringParameters.userId
  const timestamp = new Date().toISOString()

  const item = {
    userId,
    id: connectionId,
    timestamp
  }

  await docClient
    .put({
      TableName: connectionsTable,
      Item: item
    })
    .promise()

  return {
    statusCode: 200,
    body: ''
  }
}
