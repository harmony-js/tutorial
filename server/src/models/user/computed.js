import { Types } from '@harmonyjs/persistence'

export default {
  fields: {},
  queries: {
    userLogin: {
      type: Types.String,
      args: {
        email: Types.String.required,
        password: Types.String.required,
      },
      async resolve({ args: { email, password }, resolvers: { User }, context: { authentication } }) {
        // Fetch the user by its email
        const user = await User.read.unscoped({
          filter: {
            email,
          },
        })

        // If we didn't find the user, return null
        if(!user) {
          return null
        }

        // Here we "hash" the password using the base64 encoding functions from Node
        // Do not do that in production! Use a real hashing algorithm
        const hashedPassword = Buffer.from(password).toString('base64')

        // If the stored password matches the argument, return the created JWT
        if(hashedPassword === user.password) {
          return authentication.create({ user: user._id })
        }

        // Else, return null
        return null
      },
    },
  },
  mutations: {
    userCreate: {
      extends: 'create',
      async resolve({ args, resolvers: { User } }) {
        // "Hash" password
        const password = Buffer.from(args.record.password).toString('base64')

        // Create user
        return User.create({
          record: {
            ...args.record,
            password,
          }
        })
      }
    }
  },
}
