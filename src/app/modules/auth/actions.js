/* eslint-disable no-multi-spaces */

import { createAction } from 'redux-act-light'
import { NAME } from './constants'

export const attemptLogin = createAction(`${NAME}/ATTEMPT_LOGIN`)
export const attemptLoginStarted = createAction(`${NAME}/ATTEMPT_LOGIN_STARTED`)
export const attemptLoginSuccess = createAction(`${NAME}/ATTEMPT_LOGIN_SUCCESS`)
export const attemptLoginFailed = createAction(`${NAME}/ATTEMPT_LOGIN_FAILED`)

export const logout = createAction(`${NAME}/LOGOUT`)

export const needsNewAccessToken = createAction(`${NAME}/NEEDS_NEW_ACCESS_TOKEN`)

export const fetchToken = createAction(`${NAME}/FETCH_TOKEN`)
export const fetchTokenStarted = createAction(`${NAME}/FETCH_TOKEN_STARTED`)
export const fetchTokenSuccess = createAction(`${NAME}/FETCH_TOKEN_SUCCESS`)
export const fetchTokenFailed = createAction(`${NAME}/FETCH_TOKEN_FAILED`)

export const refreshToken = createAction(`${NAME}/REFRESH_TOKEN`)
export const refreshTokenStarted = createAction(`${NAME}/REFRESH_TOKEN_STARTED`)
export const refreshTokenSuccess = createAction(`${NAME}/REFRESH_TOKEN_SUCCESS`)
export const refreshTokenFailed = createAction(`${NAME}/REFRESH_TOKEN_FAILED`)

export const fetchUser = createAction(`${NAME}/FETCH_USER`)
export const fetchUserStarted = createAction(`${NAME}/FETCH_USER_STARTED`)
export const fetchUserSuccess = createAction(`${NAME}/FETCH_USER_SUCCESS`)
export const fetchUserFailed = createAction(`${NAME}/FETCH_USER_FAILED`)

export const updateUser = createAction(`${NAME}/UPDATE_USER`)
export const updateUserStarted = createAction(`${NAME}/UPDATE_USER_STARTED`)
export const updateUserSuccess = createAction(`${NAME}/UPDATE_USER_SUCCESS`)
export const updateUserFailed = createAction(`${NAME}/UPDATE_USER_FAILED`)

export const loggedIn = createAction(`${NAME}/LOGGED_IN`)
