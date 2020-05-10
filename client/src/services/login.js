import ServiceClient from './client'

export default {
  // Login with the provided email and password
  login(email, password) {
    return ServiceClient.getClient()
      .builder
      .withName('userLogin')
      .withArgs({
        email,
        password,
      })
      .asQuery()
      .catch(() => null)
  },

  // Try creating a user with the provided email and password
  // Return `null` if the creation fails
  signup(email, password) {
    return ServiceClient.getClient()
      .builder
      .withName('userCreate')
      .withArgs({
        record: {
          email,
          password,
        }
      })
      .withSelection({
        _id: true,
      })
      .asMutation()
      .catch(() => null)
  }
}
