import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  console.log('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    if (
      record.eventName !== 'INSERT' ||
      record.dynamodb.NewImage.public === 'private'
    ) {
      continue
    }

    const newItem = record.dynamodb.NewImage

    const postId = newItem.postId.S

    const body = {
      postId: newItem.postId.S,
      tags: newItem.tags.S,
      attachmentUrl: newItem.attachmentUrl.S,
      description: newItem.description.S,
      createdAt: newItem.createdAt.S
    }

    await es.index({
      index: 'images-index',
      type: 'images',
      id: postId,
      body
    })
  }
}
