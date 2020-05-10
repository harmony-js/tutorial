import { Types } from '@harmonyjs/persistence'

export default {
  fields: {
    status: {
      type: Types.Boolean,
      async resolve({ source }) {
        if(source.status) {
          return true
        }

        return false
      },
    },
  },
}
