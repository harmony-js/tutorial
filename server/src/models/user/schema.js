import { Types, PropertyMode } from '@harmonyjs/persistence'

export default {
  email: Types.String.required.indexed.unique,
  password: Types.String.required.withMode(PropertyMode.INPUT),
}
