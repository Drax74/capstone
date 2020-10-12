import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()

  return await todosAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  })
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<TodoItem> {
  return await todosAccess.deleteTodo(todoId, userId)
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<any> {
  return await todosAccess.updateTodo(updateTodoRequest, userId, todoId)
}

export async function getUploadUrl(
  todoId: string,
  userId: string
): Promise<any> {
  return await todosAccess.getUploadUrl(todoId, userId)
}
