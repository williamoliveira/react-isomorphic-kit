import { denormalize, normalize, schema } from 'normalizr'
import { MODULE_NAME } from './constants'

const productSchema = new schema.Entity(MODULE_NAME)
const productsListSchema = new schema.Array(productSchema)

const normalizeList = products => normalize(products, productsListSchema)
const denormalizeList = (ids, entities) => denormalize(ids, productsListSchema, entities)
const denormalizeSingle = (id, entities) => denormalize(id, productSchema, entities)

export { productSchema, productsListSchema, normalizeList, denormalizeList, denormalizeSingle }
