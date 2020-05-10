import Server from '@harmonyjs/server'
import Persistence from '@harmonyjs/persistence'

import ControllerAuthenticationJWT from '@harmonyjs/controller-auth-jwt'

import AdapterMongoose from '@harmonyjs/adapter-mongoose'

import User from './models/user'
import List from './models/list'
import Todo from './models/todo'
import Comment from './models/comment'

async function run() {
  const persistence = new Persistence()
  const server = Server()

  await persistence.initialize({
    strict: true,
    models: {
      User,
      List,
      Todo,
      Comment,
    },
    adapters: {
      mongo: AdapterMongoose({
        host: 'mongodb://localhost:27017',
        database: 'todolist',
      }),
    },
    defaultAdapter: 'mongo',
    log: {
      console: true,
    }
  })

  await server.initialize({
    controllers: [
      ControllerAuthenticationJWT({
        // For a production website, this secret should be loaded
        // from an environment variable and not be hard-coded!
        secret: 'my-todolist-jwt-secret',
      }),
      persistence.controllers.ControllerGraphQL({
        path: '/',
        enablePlayground: true,
        authentication: ControllerAuthenticationJWT,
      }),
      persistence.controllers.ControllerEvents(),
    ],
    log: {
      console: true,
    },
  })
}

run()
