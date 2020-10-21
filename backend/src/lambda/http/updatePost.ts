import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { updatePost } from '../../businessLogic/posts'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const updatedPost: UpdatePostRequest = JSON.parse(event.body)

  logger.info('Event: ', event)

  const post = await updatePost(updatedPost, postId, getUserId(event))

  logger.info('Updated post: ', post)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ post })
  }
}
