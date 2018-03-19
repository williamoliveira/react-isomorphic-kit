import { createSelector } from 'reselect'
import { KEY } from './reducer'

export const getStateSlice = state => state[KEY] || {}

export const getProducts = state => getStateSlice(state).products

export const getIsLoading = state => getStateSlice(state).isLoading

export const getError = state => getStateSlice(state).error
