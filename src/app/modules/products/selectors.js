import { createSelector } from 'reselect'
import { getEntities } from '../entities/selectors'
import { PRODUCTS } from './constants'
import { denormalizeList, denormalizeSingle } from './schema'

export const getNormalizedProducts = state => getEntities(state)[PRODUCTS]

export const getAllIds = createSelector(
  [getNormalizedProducts],
  normalizedProducts => (normalizedProducts ? Object.keys(normalizedProducts) : []),
)

export const getAll = createSelector([getEntities, getAllIds], (entities, ids) =>
  denormalizeList(ids, entities),
)

export const getById = createSelector([getEntities, (state, id) => id], (entities, id) =>
  denormalizeSingle(id, entities),
)
