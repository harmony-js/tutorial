import { Types } from '@harmonyjs/persistence'

export default {
  description: Types.String.required,
  status: Types.Boolean,
  list: Types.Reference.of('List').required,
}
