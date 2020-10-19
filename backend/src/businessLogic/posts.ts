import * as uuid from 'uuid'

import { PostItem } from '../models/PostItem'
import { PostsAccess } from '../dataLayer/postsAccess'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'

const postsAccess = new PostsAccess()

export async function getAllPublicPosts(): Promise<PostItem[]> {
  return await postsAccess.getAllPublicPosts()
}

export async function getAllUserPosts(userId: string): Promise<PostItem[]> {
  return await postsAccess.getAllUserPosts(userId)
}

export async function createPost(userId: string): Promise<PostItem> {
  const postId = uuid.v4()

  return await postsAccess.createPost({
    PK: `USER#${userId}`,
    SK: `POST#${postId}`,
    postId,
    userId: userId,
    createdAt: new Date().toISOString(),
    itemType: 'POST',
    public: 'private',
    publicPostId: `private#${postId}`
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
  userId: string,
  postId: string
): Promise<any> {
  return await postsAccess.updatePost(updatePostRequest, userId, postId)
}

export async function getUploadUrl(
  postId: string,
  userId: string
): Promise<any> {
  return await postsAccess.getUploadUrl(postId, userId)
}
