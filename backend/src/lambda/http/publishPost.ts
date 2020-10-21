import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { publishPost } from '../../businessLogic/posts'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('publish')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId

  logger.info('Event: ', event)

  const item = await publishPost(postId, getUserId(event))

  logger.info('Published post: ', item)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item })
  }
}
