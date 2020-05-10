import { HttpErrors } from '@harmonyjs/server'

const visibleListFilter = (args, connected) => {
  const nextArgs = { ...args }

  // Else, force filtering to target the connected user
  nextArgs.filter = nextArgs.filter || {}
  nextArgs.filter._and = nextArgs.filter._and || []

  // We add our `or` condition to a new `and` condition to avoid the risk of the `or` array
  // being polluted maliciously
  nextArgs.filter._and.push({
    _or: [
      // Either I'm the owner
      { owner: connected.user },
      // Or the list was shared with me (at least one value of "sharedTo" is me)
      { _operators: { sharedTo: { some: { eq: connected.user } } } }
    ]
  })

  return nextArgs
}

export default {
  // Queries

  // I can read a `List` when I'm authenticated. I'm limited to my own lists and lists shared with me.
  async read({ args, context: { authentication} }) {
    const connected = authentication.get()

    // If we are not connected, we cannot read a list's info
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to read a list')
    }

    return visibleListFilter(args, connected)
  },
  //  I can fetch a list of `List` when I'm authenticated. This list is limited to my own lists and lists shared with me
  async readMany({ args, context: { authentication } }) {
    const connected = authentication.get()

    // If we are not connected, we cannot list lists
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to list lists')
    }

    return visibleListFilter(args, connected)
  },

  // Mutations

  // I can create a `List`
  async create({ args, context: { authentication } }) {
    const nextArgs = { ...args }

    const connected = authentication.get()

    // If we are not connected, we cannot create a list
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to create a list')
    }

    // If we are connected, we are the owner of the created list
    nextArgs.record = nextArgs.record || {}
    nextArgs.record.owner = connected.user
  },
  // I can update a `List` if I'm its owner
  async update({ args, context: { authentication }, resolvers: { List } }) {
    const connected = authentication.get()

    // If we are not connected, we cannot update a list
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to update a list')
    }

    // Fetch the list
    const list = await List.read({ _id: args.record._id, owner: connected.user })

    if(!list || String(list.owner) !== String(connected.user)) {
      throw HttpErrors.Unauthorized('You are not the owner of that list')
    }
  },
  // I can delete a `List` if I'm its owner
  async delete({ args, context: { authentication }, resolvers: { List } }) {
    const connected = authentication.get()

    // If we are not connected, we cannot delete a list
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to delete a list')
    }

    // Fetch the list
    const list = await List.read({ _id: args._id, owner: connected.user })

    if(!list || String(list.owner) !== String(connected.user)) {
      throw HttpErrors.Unauthorized('You are not the owner of that list')
    }
  }
}
