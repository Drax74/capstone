import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Grid,
  Header,
  Image,
  Item,
  Placeholder,
  Label
} from 'semantic-ui-react'

import { getAllPublicPosts } from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'

interface NewsfeedProps {
  auth: Auth
  history: History
}

interface NewsfeedState {
  posts: Post[]
  newTodoName: string
  loadingPosts: boolean
}

export class Newsfeed extends React.PureComponent<
  NewsfeedProps,
  NewsfeedState
> {
  state: NewsfeedState = {
    posts: [],
    newTodoName: '',
    loadingPosts: true
  }

  async componentDidMount() {
    try {
      const posts = await getAllPublicPosts(this.props.auth.getIdToken())
      this.setState({
        posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Newsfeed</Header>
        {this.renderNewsfeed()}
      </div>
    )
  }

  renderNewsfeed() {
    return (
      <Grid padded>
        {this.state.loadingPosts && (
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
        {!this.state.loadingPosts &&
          !!this.state.posts.length &&
          this.state.posts.map(post => {
            return (
              <Grid.Row columns={2} stretched key={post.postId}>
                <Grid.Column>
                  <Image src={post.attachmentUrl} size="medium" />
                </Grid.Column>
                <Grid.Column>
                  <Header as="h4">{post.title}</Header>
                  <Divider />
                  <p>{post.description}</p>
                  <Divider />
                  <label>Tags:</label>
                  {post.tags.map(tag => (
                    <div>
                      <Label>{tag}</Label>
                    </div>
                  ))}
                </Grid.Column>
              </Grid.Row>
            )
          })}
      </Grid>
    )
  }
}
