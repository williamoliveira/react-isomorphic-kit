import omit from 'lodash/omit'
import { createReducer } from 'redux-act-light'
import * as entitiesActions from './actions'
import { NAME } from './constants'

// ------------------------------------
// Form Entity Reducer
// ------------------------------------
export const entitiesKey = NAME

const initialState = {
  users: {},
}

export const entitiesReducer = createReducer(
  {
    [entitiesActions.set]: (state, { payload = {} }) => {
      const newState = { ...state }

      Object.entries(payload).forEach(([entityName, entities]) => {
        if (!newState[entityName]) {
          newState[entityName] = {}
        }

        newState[entityName] = { ...newState[entityName], ...entities }
      })

      return newState
    },

    [entitiesActions.unset]: (state, { payload }) => omit(state, payload),
  },
  initialState,
)
