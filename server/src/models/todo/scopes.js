import { HttpErrors } from '@harmonyjs/server'

const todoEditScope = async ({ args, context: { authentication }, resolvers: { List } }) => {
  const connected = authentication.get()

  // If we are not connected, we cannot create a todo
  if(!connected || !connected.user) {
    throw HttpErrors.Unauthorized('You need to be authenticated to create or update a todo')
  }

  // Without a list, we cannot create a todo
  if(!args.record || !args.record.list) {
    throw HttpErrors.BadRequest('A list is needed to create or update a todo')
  }

  // Fetch the list
  const list = await List.read({
    filter: {
      _id: args.record.list,
      _or: [
        // Either I'm the owner
        { owner: connected.user },
        // Or the list was shared with me (at least one value of "sharedTo" is me)
        { _operators: { sharedTo: { some: { eq: connected.user } } } }
      ]
    }
  })

  if(!list) {
    throw HttpErrors.Unauthorized('You don\'t have access to this list')
  }
}

export default {
  async count() {
    return null
  },
  // Mutations
  create: todoEditScope,
  update: todoEditScope,
  async delete({ args, context: { authentication }, resolvers: { List, Todo } }) {
    const connected = authentication.get()

    // If we are not connected, we cannot delete a todo
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to delete a todo')
    }

    // Fetch the todo
    const todo = await Todo.read({ filter: { _id: args._id } })

    // Fetch the list
    const list = await List.read({
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
      throw HttpErrors.Unauthorized('You don\'t have access to this todo\'s list')
    }
  },
}
