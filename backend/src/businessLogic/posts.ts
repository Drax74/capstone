import * as uuid from 'uuid'

import { PostItem } from '../models/PostItem'
import { PostsAccess } from '../dataLayer/postsAccess'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { CreatePostRequest } from '../requests/CreatePostRequest'

const postsAccess = new PostsAccess()

export async function getAllPublicPosts(): Promise<PostItem[]> {
  return await postsAccess.getAllPublicPosts()
}

export async function getAllUserPosts(userId: string): Promise<PostItem[]> {
  return await postsAccess.getAllUserPosts(userId)
}

export async function getUserPost(
  userId: string,
  postId: string
): Promise<PostItem> {
  return await postsAccess.getUserPost(userId, postId)
}

export async function createPost(
  createPostRequest: CreatePostRequest,
  userId: string
): Promise<PostItem> {
  const postId = uuid.v4()

  return await postsAccess.createPost({
    PK: `USER#${userId}`,
    SK: `POST#${postId}`,
    postId,
    userId: userId,
    title: createPostRequest.title,
    createdAt: new Date().toISOString(),
    itemType: 'POST',
    public: 'private',
    publicPostId: `private#${postId}`,
    tags: [],
    attachmentUrl: ''
  })
}

export async function deletePost(
  postId: string,
  userId: string
): Promise<PostItem> {
  return await postsAccess.deletePost(postId, userId)
}

export async function updatePost(
  updatePostRequest: UpdatePostRequest,
  postId: string,
  userId: string
): Promise<any> {
  return await postsAccess.updatePost(updatePostRequest, postId, userId)
}

export async function getUploadUrl(
  postId: string,
  userId: string
): Promise<any> {
  return await postsAccess.getUploadUrl(postId, userId)
}

export async function publishPost(
  postId: string,
  userId: string
): Promise<any> {
  return await postsAccess.publishPost(postId, userId)
}
