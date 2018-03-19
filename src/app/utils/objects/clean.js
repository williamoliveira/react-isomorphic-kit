import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export default obj => pickBy(obj, identity)
