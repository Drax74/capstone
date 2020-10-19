import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { deletePost } from '../../businessLogic/posts'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('delete')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId

  logger.info('Event: ', event)

  const deletedItem = await deletePost(postId, getUserId(event))

  logger.info('Deleted item: ', deletedItem)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      deletedItem
    })
  }
}
