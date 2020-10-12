import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const s3bucket = process.env.IMAGES_S3_BUCKET
const presignedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
const userIdIndex = process.env.USER_ID_INDEX

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    return todoItem
  }

  async deleteTodo(todoId: string, userId: string): Promise<TodoItem> {
    const deletedItem = await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        ReturnValues: 'ALL_OLD'
      })
      .promise()

    return deletedItem.Attributes as TodoItem
  }

  async updateTodo(
    todoUpdated: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoItem> {
    const updatedTodo = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': todoUpdated.name,
          ':dueDate': todoUpdated.dueDate,
          ':done': todoUpdated.done
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    return updatedTodo.Attributes as TodoItem
  }

  async getUploadUrl(todoId: string, userId: string) {
    await this.attachImageURLToTodo(todoId, userId)
    const uploadUrl = this.generatePresignedURL(todoId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  }

  async attachImageURLToTodo(todoId: string, userId: string) {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${s3bucket}.s3.amazonaws.com/${todoId}`
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
  }

  generatePresignedURL(todoId: string) {
    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    const uploadURL = s3.getSignedUrl('putObject', {
      Bucket: s3bucket,
      Key: todoId,
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
