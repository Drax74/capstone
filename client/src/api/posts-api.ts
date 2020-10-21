import { apiEndpoint } from '../config'
import { Post } from '../types/Post'
import Axios from 'axios'
import { UpdatePostRequest } from '../types/UpdatePostRequest'
import { CreatePostRequest } from '../types/CreatePostRequest'

interface UploadFileData {
  uploadUrl: string
  attachmentUrl: string
}

export async function getAllPublicPosts(idToken: string): Promise<Post[]> {
  const response = await Axios.get(`${apiEndpoint}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.items
}

export async function getAllUserPosts(idToken: string): Promise<Post[]> {
  const response = await Axios.get(`${apiEndpoint}/user/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.items
}

export async function getUserPost(
  idToken: string,
  postId: string
): Promise<Post> {
  const response = await Axios.get(`${apiEndpoint}/user/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function createPost(
  idToken: string,
  post: CreatePostRequest
): Promise<Post> {
  const response = await Axios.post(
    `${apiEndpoint}/posts`,
    JSON.stringify(post),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log(response)
  return response.data.item
}

export async function patchPost(
  idToken: string,
  updatedPost: UpdatePostRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/posts/${updatedPost.postId}`,
    JSON.stringify(updatedPost),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deletePost(
  idToken: string,
  postId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function publishPost(idToken: string, post: Post): Promise<Post> {
  const response = await Axios.patch(
    `${apiEndpoint}/posts/publish/${post.postId}`,
    JSON.stringify(post),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function getUploadUrl(
  idToken: string,
  postId: string
): Promise<UploadFileData> {
  const response = await Axios.post(
    `${apiEndpoint}/posts/${postId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  const response = await Axios.put(uploadUrl, file)
  return response.data
}
