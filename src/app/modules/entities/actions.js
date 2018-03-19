/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { NAME } from './constants'

export const set = createAction(`${NAME}/SET`)
export const unset = createAction(`${NAME}/UNSET`)
