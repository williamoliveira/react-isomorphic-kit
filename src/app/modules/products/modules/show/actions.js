/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import { SUB_MODULE_NAME } from './constants'

const NAME = `${MODULE_NAME}/${SUB_MODULE_NAME}`

export const fetchOne = createAction(`${NAME}/FETCH_ONE`)
export const fetchOneStarted = createAction(`${NAME}/FETCH_ONE_STARTED`)
export const fetchOneSuccess = createAction(`${NAME}/FETCH_ONE_SUCCESS`)
export const fetchOneFailed = createAction(`${NAME}/FETCH_ONE_FAILED`)
