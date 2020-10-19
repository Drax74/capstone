export interface PostItem {
  PK: string
  SK: string
  userId: string
  postId: string
  createdAt: string
  public: string
  itemType: string
  publicPostId: string
  description?: string
  tags?: string[]
  attachmentUrl?: string
}
