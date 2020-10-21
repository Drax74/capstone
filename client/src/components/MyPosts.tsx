import * as React from 'react'
import Auth from '../auth/Auth'
import {
  getAllUserPosts,
  patchPost,
  createPost,
  deletePost,
  publishPost
} from '../api/posts-api'
import { Post } from '../types/Post'
import { Item, Placeholder, Grid } from 'semantic-ui-react'
import { EditPost } from './EditPost'
import PostModal from './PostModal'

interface MyPostsProps {
  auth: Auth
}

interface MyPostState {
  posts: Post[]
  loading: boolean
}

export class MyPosts extends React.PureComponent<MyPostsProps, MyPostState> {
  constructor(props: MyPostsProps) {
    super(props)

    this.updatePostState = this.updatePostState.bind(this)
    this.savePostToDB = this.savePostToDB.bind(this)
    this.createNewPost = this.createNewPost.bind(this)
    this.deletePost = this.deletePost.bind(this)
    this.publishPost = this.publishPost.bind(this)
  }

  state: MyPostState = {
    posts: [],
    loading: true
  }

  async componentDidMount() {
    try {
      const posts = await getAllUserPosts(this.props.auth.getIdToken())
      this.setState({ posts, loading: false })
    } catch {
      alert('Fetching posts failed')
    }
  }

  updatePostState(post: Post) {
    this.setState(prevState => ({
      posts: prevState.posts.map(p => (p.postId !== post.postId ? p : post))
    }))
  }

  async savePostToDB(post: Post) {
    try {
      await patchPost(this.props.auth.getIdToken(), post)
    } catch {
      alert('Updating posts failed')
    }
  }

  async createNewPost(title: string) {
    const idToken = this.props.auth.getIdToken()
    try {
      const newPost = await createPost(idToken, { title })
      this.setState(prevState => ({ posts: [newPost].concat(prevState.posts) }))
    } catch {
      alert('Post creation failed')
    }
  }

  async deletePost(post: Post) {
    const idToken = this.props.auth.getIdToken()
    try {
      await deletePost(idToken, post.postId)
      this.setState(prevState => ({
        posts: prevState.posts.filter(p => p.postId !== post.postId)
      }))
    } catch {
      alert('Post deletion failed')
    }
  }

  async publishPost(post: Post) {
    const idToken = this.props.auth.getIdToken()
    try {
      const publishedPost = await publishPost(idToken, post)
      this.setState(prevState => ({
        posts: prevState.posts.map(p =>
          p.postId !== publishedPost.postId ? p : publishedPost
        )
      }))
    } catch {
      alert('Publishing post failed')
    }
  }

  render() {
    const { loading, posts } = this.state
    return (
      <div>
        <Grid>
          <Grid.Column floated="left" width={5}>
            <h1>My Posts</h1>
          </Grid.Column>
          <Grid.Column floated="right" width={3}>
            <PostModal createNewPost={this.createNewPost} />
          </Grid.Column>
        </Grid>

        {loading && (
          <Item.Group divided>
            {[1, 2, 3].map(item => (
              <Item key={item}>
                <Item.Image
                  src="https://react.semantic-ui.com/images/wireframe/image.png"
                  size="medium"
                />
                <Item.Content>
                  <Item.Header as="a">
                    <Placeholder>
                      <Placeholder.Line />
                    </Placeholder>
                  </Item.Header>
                  <Item.Description>
                    <Placeholder>
                      <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                      </Placeholder.Paragraph>
                    </Placeholder>
                  </Item.Description>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        )}
        {!loading && !!posts.length && (
          <Item.Group divided>
            {posts.map(post => (
              <Item key={post.postId}>
                <EditPost
                  post={post}
                  auth={this.props.auth}
                  updatePostState={this.updatePostState}
                  savePostToDB={this.savePostToDB}
                  deletePost={this.deletePost}
                  publishPost={this.publishPost}
                />
              </Item>
            ))}
          </Item.Group>
        )}
      </div>
    )
  }
}
