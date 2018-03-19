import { createSelector } from 'reselect'
import { entitiesKey } from './reducers'

export const getEntities = state => state[entitiesKey] || {}
