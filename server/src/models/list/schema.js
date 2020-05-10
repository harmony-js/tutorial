import { Types } from '@harmonyjs/persistence'

export default {
  name: Types.String.required,
  description: Types.String,
  owner: Types.Reference.of('User'),
  sharedTo: [Types.Reference.of('User')],
}
