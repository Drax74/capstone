/**
 * Fields in a request to update a single POST item.
 */
export interface UpdatePostRequest {
  title: string
  description: string
  public: string
  tags: string[]
}
