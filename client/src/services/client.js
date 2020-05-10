import Client from '@harmonyjs/query'

export default {
  // Configure HarmonyJS client
  configureClient(token) {
    const config = {
      graphql: {
        host: 'http://localhost',
        port: 3000,
        path: '/',
      },
      socket: {
        host: 'http://localhost',
        port: 3000,
      },
    }

    if(token) {
      // Add authorization headers if token was provided
      config.graphql.headers = {
        authorization: 'Bearer ' + token,
      }
    }

    Client.configure(config)
  },

  // Provide HarmonyJS client
  getClient() {
    return Client
  }
}
