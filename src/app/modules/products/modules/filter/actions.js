/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import { SUB_MODULE_NAME } from './constants'

const NAME = `${MODULE_NAME}/${SUB_MODULE_NAME}`

export const fetchMany = createAction(`${NAME}/FETCH_MANY`)
export const fetchManyStarted = createAction(`${NAME}/FETCH_MANY_STARTED`)
export const fetchManySuccess = createAction(`${NAME}/FETCH_MANY_SUCCESS`)
export const fetchManyFailed = createAction(`${NAME}/FETCH_MANY_FAILED`)

export const reset = createAction(`${NAME}/RESET`)
