/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { NAME } from './constants'

export const beforeAppStart = createAction(`${NAME}/BEFORE_APP_START`)
export const beforeAppStartDone = createAction(`${NAME}/BEFORE_APP_START_DONE`)

export const appStarted = createAction(`${NAME}/APP_STARTED`)
export const ready = createAction(`${NAME}/READY`)

export const error = createAction(`${NAME}/ERROR`)

export const initialFetchStarted = createAction(`${NAME}/INITIAL_FETCH_STARTED`)
export const initialFetchSuccess = createAction(`${NAME}/INITIAL_FETCH_SUCCESS`)
export const initialFetchFailed = createAction(`${NAME}/INITIAL_FETCH_FAILED`)

export const setLocationSearch = createAction(`${NAME}/SET_LOCATION_SEARCH`)

export const showToast = createAction(`${NAME}/SHOW_TOAST`)
