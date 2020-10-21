import * as React from 'react'
import {
  Form,
  Button,
  TextArea,
  Label,
  Image,
  Grid,
  Icon
} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/posts-api'
import { Post } from '../types/Post'
import DebouncedInput from './debounceInput'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditPostProps {
  post: Post
  auth: Auth
  updatePostState: (post: Post) => void
  savePostToDB: (post: Post) => void
  deletePost: (post: Post) => void
  publishPost: (post: Post) => void
}

interface EditPostState {
  file: any
  uploadState: UploadState
  tag: string
}

export class EditPost extends React.PureComponent<
  EditPostProps,
  EditPostState
> {
  state: EditPostState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    tag: ''
  }

  fileInputRef = React.createRef<HTMLInputElement>()

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })

    this.uploadFile(files[0])
  }

  uploadFile = async (file: File) => {
    try {
      this.setUploadState(UploadState.FetchingPresignedUrl)
      const { uploadUrl, attachmentUrl } = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.post.postId
      )

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, file)

      this.updatePostState({ ...this.props.post, attachmentUrl })
      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  updatePostState(post: Post) {
    this.props.updatePostState(post)
  }

  descriptionChange(description: string) {
    const post = {
      ...this.props.post,
      description: description
    }
    this.updatePostState(post)
    this.props.savePostToDB(post)
  }

  titleChange(title: string) {
    const post = {
      ...this.props.post,
      title: title
    }
    this.updatePostState(post)
    this.props.savePostToDB(post)
  }

  tagChange(tag: string) {
    this.setState({ tag })
  }

  addTag() {
    if (this.state.tag === '') {
      return
    }
    const post = {
      ...this.props.post,
      tags: this.props.post.tags.concat(this.state.tag)
    }
    this.setState({ tag: '' })
    this.updatePostState(post)
    this.props.savePostToDB(post)
  }

  removeTag(tag: string) {
    const post = {
      ...this.props.post,
      tags: this.props.post.tags.filter(t => t !== tag)
    }
    this.updatePostState(post)
    this.props.savePostToDB(post)
  }

  deletePost() {
    this.props.deletePost(this.props.post)
  }

  publishPost() {
    this.props.publishPost(this.props.post)
  }

  render() {
    const { post } = this.props
    const postImage =
      post && post.attachmentUrl
        ? post.attachmentUrl
        : 'https://react.semantic-ui.com/images/wireframe/image.png'
    return (
      <Grid style={{ width: '100%' }}>
        <Grid.Row columns={2} stretched>
          <Grid.Column>
            <Image src={postImage} size="medium" />
          </Grid.Column>
          <Grid.Column>
            <Form>
              <Form.Group>
                <Form.Field>
                  <Button
                    loading={this.state.uploadState !== UploadState.NoUpload}
                    content="Upload File"
                    labelPosition="left"
                    icon="file"
                    disabled={post.public === 'public'}
                    onClick={() =>
                      this.fileInputRef.current &&
                      this.fileInputRef.current.click()
                    }
                  />
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    onChange={this.handleFileChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Button
                    content="Publish"
                    disabled={post.public === 'public'}
                    onClick={() => this.publishPost()}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Button
                    content="Delete post"
                    disabled={post.public === 'public'}
                    onClick={() => this.deletePost()}
                  />
                </Form.Field>
              </Form.Group>

              <Form.Field>
                <label>Title</label>
                <DebouncedInput
                  value={post.title}
                  onChange={(value: string) => this.titleChange(value)}
                  delay={1000}
                  renderProps={(props: any) => (
                    <input
                      {...props}
                      placeholder="Title"
                      readOnly={post.public === 'public'}
                    />
                  )}
                />
              </Form.Field>
              <Form.Field>
                <DebouncedInput
                  value={post.description}
                  onChange={(value: string) => this.descriptionChange(value)}
                  delay={1000}
                  renderProps={(props: any) => (
                    <TextArea
                      {...props}
                      placeholder="Description"
                      rows={5}
                      cols={50}
                      readOnly={post.public === 'public'}
                    />
                  )}
                />
              </Form.Field>
              <Form.Group>
                <Form.Input
                  placeholder="tag"
                  name="tag"
                  value={this.state.tag}
                  onChange={e => this.tagChange(e.target.value)}
                  readOnly={post.public === 'public'}
                />
                <Form.Button
                  content="Add tag"
                  onClick={() => this.addTag()}
                  disabled={post.public === 'public'}
                />
              </Form.Group>
              {this.props.post.tags.map(tag => (
                <Label>
                  {tag}
                  <Icon
                    name="delete"
                    onClick={() => this.removeTag(tag)}
                    disabled={post.public === 'public'}
                  />
                </Label>
              ))}
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
