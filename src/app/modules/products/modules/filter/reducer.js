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
  error: false,
  products: [],
}

export default createReducer(
  {
    [actions.fetchManyStarted]: (state, { payload }) => ({
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
      products: payload.products || [],
    }),
  },
  initialState,
)
