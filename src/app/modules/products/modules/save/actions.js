/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { MODULE_NAME } from '../../constants'
import { SUB_MODULE_NAME } from './constants'

const NAME = `${MODULE_NAME}/${SUB_MODULE_NAME}`

export const saveOne = createAction(`${NAME}/SAVE_ONE`)
export const saveOneStarted = createAction(`${NAME}/SAVE_ONE_STARTED`)
export const saveOneSuccess = createAction(`${NAME}/SAVE_ONE_SUCCESS`)
export const saveOneFailed = createAction(`${NAME}/SAVE_ONE_FAILED`)

export const createOne = createAction(`${NAME}/CREATE_ONE`)
export const createOneStarted = createAction(`${NAME}/CREATE_ONE_STARTED`)
export const createOneSuccess = createAction(`${NAME}/CREATE_ONE_SUCCESS`)
export const createOneFailed = createAction(`${NAME}/CREATE_ONE_FAILED`)

export const updateOne = createAction(`${NAME}/UPDATE_ONE`)
export const updateOneStarted = createAction(`${NAME}/UPDATE_ONE_STARTED`)
export const updateOneSuccess = createAction(`${NAME}/UPDATE_ONE_SUCCESS`)
export const updateOneFailed = createAction(`${NAME}/UPDATE_ONE_FAILED`)
