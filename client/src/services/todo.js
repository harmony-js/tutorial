import { Accessor } from '@harmonyjs/query'

const AccessorTodo = Accessor('Todo')
const AccessorComment = Accessor('Comment')

export default {
  // Create a todo with the given description
  create(list, description) {
    return AccessorTodo.mutate
      .create
      .withRecord({
        list,
        description,
      })
      .catch(() => null)
  },

  // Toggle the state of the given todo
  toggle(todo, list) {
    return AccessorTodo.mutate
      .update
      .withId(todo._id)
      .withRecord({
        list,
        status: !todo.status,
      })
      .catch(() => null)
  },

  // Delete the given todo
  delete(todo) {
    return AccessorTodo.mutate
      .delete
      .withId(todo._id)
      .catch(() => null)
  },

  // Create a new comment on a todo
  comment(todo, content) {
    return AccessorComment.mutate
      .create
      .withRecord({
        todo,
        content,
        date: new Date().toISOString(),
      })
      .catch(() => null)
  },

  // List all comments for a given todo
  fetchComments(todo) {
    return AccessorComment.query
      .list
      .where({ todo })
      .select({
        author: {
          _id: true,
          email: true,
        },
        content: true,
        date: true,
      })
  }
}
