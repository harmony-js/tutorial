
import { HttpErrors } from '@harmonyjs/server'

async function fetchListForTodo(todoId, { Todo, List }, connected) {
  // Fetch the todo
  const todo = await Todo.read({ filter: { _id: todoId } })

  // Fetch the list
  const list = List.read({
    filter: {
      _id: todo.list,
      _or: [
        // Either I'm the owner
        { owner: connected.user },
        // Or the list was shared with me (at least one value of "sharedTo" is me)
        { _operators: { sharedTo: { some: { eq: connected.user } } } }
      ]
    }
  })

  if(!list) {
    throw HttpErrors.Unauthorized('You don\'t have access to this todo')
  }
}

export default {
  // Queries
  async readMany({ args, context: { authentication }, resolvers: { Todo, List } }) {
    const connected = authentication.get()

    // If we are not connected, we cannot list comments
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to list comments')
    }

    // Without a todo, we cannot list comments
    if(!args.filter || !args.filter.todo) {
      throw HttpErrors.BadRequest('A todo is needed to list comments')
    }

    // Fetch the list and check access
    const list = await fetchListForTodo(args.filter.todo, { Todo, List }, connected)
  },

  // Mutations
  async create({ args, context: { authentication }, resolvers: { Todo, List } }) {
    const nextArgs = { ...args }

    const connected = authentication.get()

    // If we are not connected, we cannot create a comment
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to create a comment')
    }

    // Without a todo, we cannot create a comment
    if(!args.record || !args.record.todo) {
      throw HttpErrors.BadRequest('A todo is needed to create a comment')
    }

    // Fetch the list and check access
    const list = await fetchListForTodo(args.record.todo, { Todo, List }, connected)

    // If everything is ok, inject the connected user as the author
    nextArgs.record.author = connected.user

    return nextArgs
  },
}
