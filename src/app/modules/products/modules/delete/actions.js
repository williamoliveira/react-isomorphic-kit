/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import { SUB_MODULE_NAME } from './constants'

const NAME = `${MODULE_NAME}/${SUB_MODULE_NAME}`

export const deleteOne = createAction(`${NAME}/DELETE_ONE`)
export const deleteOneStarted = createAction(`${NAME}/DELETE_ONE_STARTED`)
export const deleteOneSuccess = createAction(`${NAME}/DELETE_ONE_SUCCESS`)
export const deleteOneFailed = createAction(`${NAME}/DELETE_ONE_FAILED`)
