import React from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

interface PostModalProps {
  createNewPost: (title: string) => void
}

function PostModal(props: PostModalProps) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')

  return (
    <Modal
      onClose={() => {
        setOpen(false)
        setTitle('')
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Create a Post</Button>}
    >
      <Modal.Header>Create a Post</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Title</label>
            <input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Field>
          <Button
            type="submit"
            onClick={() => {
              props.createNewPost(title)
              setOpen(false)
              setTitle('')
            }}
          >
            Create
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default PostModal
