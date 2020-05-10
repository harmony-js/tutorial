import { Types } from '@harmonyjs/persistence'
import { HttpErrors } from '@harmonyjs/server'

export default {
  fields: {
    todos: {
      type: [Types.ReversedReference.of('Todo').on('list')],
    },
    isOwner: {
      type: Types.Boolean,
      async resolve({ source, context: { authentication } }) {
        const connected = authentication.get()

        return String(connected && connected.user) === String(source.owner)
      }
    },
    info: {
      type: {
        nbTotal: Types.Number,
        nbPending: Types.Number,
        nbDone: Types.Number,
      },
      async resolve({ source }) {
        // Simply forward source for now
        return source
      },
    },
  },
  custom: {
    ListInfo: {
      nbTotal: async ({ source, resolvers: { Todo } }) => {
        return Todo.count({ filter: { list: source._id } })
      },
      nbPending: async ({ source, resolvers: { Todo } }) => {
        return Todo.count({ filter: { list: source._id, _operators: { status: { neq: true } } } })
      },
      nbDone: async ({ source, resolvers: { Todo } }) => {
        return Todo.count({ filter: { list: source._id, status: true } })
      },
    },
  },

  mutations: {
    listShare: {
      type: Types.Reference.of('List'),
      args: {
        list: Types.ID,
        email: Types.String,
      },
      async resolve({ args, context: { authentication }, resolvers: { User, List } }) {
        const user = await User.read.unscoped({
          filter: {
            email: args.email,
          },
        })

        if(!user) {
          throw HttpErrors.BadRequest('No user with the given email')
        }

        const list = await List.read.unscoped({
          filter: {
            _id: args.list,
          },
        })

        if(!list.sharedTo.find((id) => String(id) === String(user._id))) {
          list.sharedTo.push(user._id)
        }

        return List.update({
          record: {
            _id: list._id,
            sharedTo: list.sharedTo,
          }
        })
      },
    },
  },
}
