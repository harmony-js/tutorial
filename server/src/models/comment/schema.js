import { Types } from '@harmonyjs/persistence'

export default {
  content: Types.String.required,
  date: Types.Date.required,
  author: Types.Reference.of('User'),
  todo: Types.Reference.of('Todo'),
}
