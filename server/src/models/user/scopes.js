import { HttpErrors } from '@harmonyjs/server'

export default {
  // Queries
  async read({ args, context: { authentication } }) {
    const nextArgs = { ...args }

    const connected = authentication.get()

    // If we are not connected, we cannot read a user's info
    if(!connected || !connected.user) {
      throw HttpErrors.Unauthorized('You need to be authenticated to read a user')
    }

    // Else, force filtering to target the connected user
    nextArgs.filter = nextArgs.filter || {}
    nextArgs.filter._id = connected.user

    return nextArgs
  },

  // Mutations
  async create({ context: { authentication } }) {
    const connected = authentication.get()

    // If we are already connected, we cannot create a new user
    if(connected && connected.user) {
      throw HttpErrors.Unauthorized('An authenticated user cannot create a new user')
    }
  }
}
