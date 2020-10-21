import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { createPost } from '../../businessLogic/posts'
import { getUserId } from '../utils'
import { CreatePostRequest } from '../../requests/CreatePostRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newPost: CreatePostRequest = JSON.parse(event.body)

  const item = await createPost(newPost, getUserId(event))

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
