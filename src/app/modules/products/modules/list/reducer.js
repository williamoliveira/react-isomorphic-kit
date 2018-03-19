import parseAxiosError from '../../../../utils/parseAxiosError'
import { createReducer } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import * as actions from './actions'
import { SUB_MODULE_NAME } from './constants'

export const KEY = `${MODULE_NAME}${SUB_MODULE_NAME}`

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  currentPage: 0,
  lastPage: 0,
  totalNumber: 0,
  fetchedNumber: 0,
  currentPageIds: [],
  pagination: {
    currentPage: 1,
    total: 1,
    lastPage: 1,
    from: 1,
    to: 1,
  },
}

export default createReducer(
  {
    [actions.fetchManyStarted]: state => ({
      ...state,
      isLoading: true,
      error: null,
    }),

    [actions.fetchManyFailed]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: parseAxiosError(payload.error),
    }),

    [actions.fetchManySuccess]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: null,
      currentPage: payload.pagination.currentPage,
      lastPage: payload.pagination.lastPage,
      totalNumber: payload.pagination.total,
      fetchedNumber:
        state.fetchedNumber + (payload.pagination.to - payload.pagination.from),
      currentPageIds: payload.normalized.result || [],
      pagination: payload.pagination,
    }),
  },
  initialState,
)
