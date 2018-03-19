import { createSelector } from 'reselect'
import { getEntities } from '../../../entities/selectors'
import { denormalizeList } from '../../schema'
import { KEY } from './reducer'

export const getStateSlice = state => state[KEY] || {}

const getCurrentPageIds = state => getStateSlice(state).currentPageIds

export const getCurrentPageProducts = createSelector(
  [getEntities, getCurrentPageIds],
  (entities, productIds) => denormalizeList(productIds, entities),
)

export const getPagination = state => getStateSlice(state).pagination

export const getIsLoading = state => getStateSlice(state).isLoading

export const getError = state => getStateSlice(state).error
