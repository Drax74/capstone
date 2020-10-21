import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { PostItem } from '../models/PostItem'
import { PostUpdate } from '../models/PostUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('DB access')

const s3bucket = process.env.IMAGES_S3_BUCKET
const presignedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
const postsByStatusIndex = process.env.POSTS_BY_STATUS_INDEX

export class PostsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly postsTable = process.env.POSTS_TABLE
  ) {}

  async getAllPublicPosts(): Promise<PostItem[]> {
    const params = {
      TableName: this.postsTable,
      IndexName: postsByStatusIndex,
      KeyConditionExpression:
        'itemType = :itemType AND begins_with(publicPostId, :status)',
      ExpressionAttributeValues: {
        ':itemType': 'POST',
        ':status': 'public'
      }
    }
    const result = await this.docClient.query(params).promise()
    return result.Items as PostItem[]
  }

  async getAllUserPosts(userId: string): Promise<PostItem[]> {
    const params = {
      TableName: this.postsTable,
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': `USER#${userId}`
      }
    }
    const result = await this.docClient.query(params).promise()
    return result.Items as PostItem[]
  }

  async getUserPost(userId: string, postId: string): Promise<PostItem> {
    const params = {
      TableName: this.postsTable,
      Key: {
        PK: `USER#${userId}`,
        SK: `POST#${postId}`
      }
    }
    const result = await this.docClient.get(params).promise()
    return result.Item as PostItem
  }

  async createPost(postItem: PostItem): Promise<PostItem> {
    await this.docClient
      .put({
        TableName: this.postsTable,
        Item: postItem
      })
      .promise()

    return postItem
  }

  async deletePost(postId: string, userId: string): Promise<PostItem> {
    const params = {
      TableName: this.postsTable,
      Key: {
        PK: `USER#${userId}`,
        SK: `POST#${postId}`
      },
      ReturnValues: 'ALL_OLD'
    }
    const deletedItem = await this.docClient.delete(params).promise()
    return deletedItem.Attributes as PostItem
  }

  async updatePost(
    postUpdated: PostUpdate,
    postId: string,
    userId: string
  ): Promise<PostItem> {
    const params = {
      TableName: this.postsTable,
      Key: {
        PK: `USER#${userId}`,
        SK: `POST#${postId}`
      },
      UpdateExpression:
        'set #t = :title, description = :description, #p = :public, publicPostId = :publicPostId, tags = :tags',
      ExpressionAttributeNames: {
        '#p': 'public',
        '#t': 'title'
      },
      ExpressionAttributeValues: {
        ':title': postUpdated.title,
        ':description': postUpdated.description,
        ':public': postUpdated.public,
        ':tags': postUpdated.tags,
        ':publicPostId':
          postUpdated.public === 'public'
            ? `public#${postId}`
            : `private#${postId}`
      },
      ReturnValues: 'ALL_NEW'
    }

    const updatedPost = await this.docClient.update(params).promise()

    logger.info('Updated post: ', updatedPost)

    return updatedPost.Attributes as PostItem
  }

  async publishPost(postId: string, userId: string): Promise<PostItem> {
    const params = {
      TableName: this.postsTable,
      Key: {
        PK: `USER#${userId}`,
        SK: `POST#${postId}`
      },
      UpdateExpression: 'set #p = :public, publicPostId = :publicPostId',
      ExpressionAttributeNames: {
        '#p': 'public'
      },
      ExpressionAttributeValues: {
        ':public': 'public',
        ':publicPostId': `public#${postId}`
      },
      ReturnValues: 'ALL_NEW'
    }

    const publishedPost = await this.docClient.update(params).promise()

    logger.info('Updated post: ', publishedPost)

    return publishedPost.Attributes as PostItem
  }

  async getUploadUrl(postId: string, userId: string) {
    const attachmentUrl = await this.attachImageURLToPost(postId, userId)
    const uploadUrl = this.generatePresignedURL(postId)
    return { uploadUrl, attachmentUrl }
  }

  async attachImageURLToPost(postId: string, userId: string) {
    const attachmentUrl = `https://${s3bucket}.s3.amazonaws.com/${postId}`
    await this.docClient
      .update({
        TableName: this.postsTable,
        Key: {
          PK: `USER#${userId}`,
          SK: `POST#${postId}`
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    return attachmentUrl
  }

  generatePresignedURL(postId: string) {
    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    const uploadURL = s3.getSignedUrl('putObject', {
      Bucket: s3bucket,
      Key: postId,
      Expires: presignedUrlExpiration
    })
    return uploadURL
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
