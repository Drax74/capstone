import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { PostItem } from '../models/PostItem'
import { PostUpdate } from '../models/PostUpdate'

const s3bucket = process.env.IMAGES_S3_BUCKET
const presignedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
const postsByStatusIndex = process.env.POSTS_BY_STATUS_INDEX

export class PostsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly postsTable = process.env.POSTS_TABLE
  ) {}

  async getAllPublicPosts(): Promise<PostItem[]> {
    console.log('Getting all public posts')

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
    console.log('Getting all user posts')
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
        'set description = :description, #p = :public, publicPostId = :publicPostId, tags =: tags',
      ExpressionAttributeNames: {
        '#p': 'public'
      },
      ExpressionAttributeValues: {
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

    return updatedPost.Attributes as PostItem
  }

  async getUploadUrl(postId: string, userId: string) {
    await this.attachImageURLToPost(postId, userId)
    const uploadUrl = this.generatePresignedURL(postId)
    return uploadUrl
  }

  async attachImageURLToPost(postId: string, userId: string) {
    await this.docClient
      .update({
        TableName: this.postsTable,
        Key: {
          userId: userId,
          postId: postId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${s3bucket}.s3.amazonaws.com/${postId}`
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
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
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
