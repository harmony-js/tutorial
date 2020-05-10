import { Accessor } from '@harmonyjs/query'

import ServiceClient from './client'

const AccessorList = Accessor('List')

export default {
  // Create a list query fetching all of a user's list
  fetchAll() {
    return AccessorList.query
      .list
      .select({
        _id: true,
        name: true,
        description: true,
        isOwner: true,
        todos: {
          _id: true,
          status: true,
          description: true,
        },
        info: {
          nbTotal: true,
          nbDone: true,
          nbPending: true,
        },
        sharedTo: {
          _id: true,
          email: true,
        }
      })
      .listen('Todo')
  },

  // Create a list with the given name
  create(name) {
    return AccessorList.mutate
      .create
      .withRecord({
        name,
        description: '',
      })
      .catch(() => null)
  },

  // Update the given list's name
  updateName(list, name) {
    return AccessorList.mutate
      .update
      .withId(list)
      .withRecord({ name })
      .catch(() => null)
  },

  // Update the given list's description
  updateDescription(list, description) {
    return AccessorList.mutate
      .update
      .withId(list)
      .withRecord({ description })
      .catch(() => null)
  },

  // Delete the given list
  delete(list) {
    return AccessorList.mutate
      .delete
      .withId(list)
      .catch(() => null)
  },

  // Share the given list to the provided email
  share(list, email) {
    return ServiceClient.getClient().builder
      .withName('listShare')
      .withArgs({
        list,
        email,
      })
      .withSelection({
        _id: true,
      })
      .asMutation()
  }
}
