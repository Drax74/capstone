import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllPublicPosts } from '../../businessLogic/posts'

export const handler: APIGatewayProxyHandler = async (): Promise<
  APIGatewayProxyResult
> => {
  const posts = await getAllPublicPosts()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ items: posts })
  }
}
