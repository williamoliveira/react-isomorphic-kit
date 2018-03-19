import persistReducer from 'redux-persist/lib/persistReducer'
import CookieStorage from 'redux-persist-cookie-storage'
import { createReducer } from 'redux-act-light'
import * as actions from './actions'
import { NAME } from './constants'
import parseAxiosError from '../../utils/parseAxiosError'
import reduxPersistStorageAdapter from '../../utils/reduxPersistStorageAdapter'

// ------------------------------------
// Auth Entity Reducer
// ------------------------------------
export const KEY = NAME

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isUnlocked: false,
  needsNewAccessToken: false, // TODO remove?

  isFetchingToken: false,
  fetchTokenError: null,
  isFetchingUser: false,
  fetchUserError: null,
  isUpdatingUser: false,
}

export const authReducer = createReducer(
  {
    [actions.fetchTokenSuccess]: (state, { payload }) => ({
      ...state,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      needsNewAccessToken: false,
      isFetchingToken: false,
    }),

    [actions.fetchTokenFailed]: (state, { payload }) => ({
      ...state,
      accessToken: null,
      isFetchingToken: false,
    }),

    [actions.fetchUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      isFetchingUser: false,
    }),

    [actions.updateUserStarted]: state => ({
      ...state,
      isUpdatingUser: true,
    }),

    [actions.updateUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload.user,
      isUpdatingUser: false,
    }),

    [actions.updateUserFailed]: state => ({
      ...state,
      isUpdatingUser: false,
    }),

    [actions.logout]: state => ({
      ...state,
      user: null,
      accessToken: null,
      isUnlocked: false,
    }),

    [actions.unlockSuccess]: state => ({
      ...state,
      isUnlocked: true,
    }),

    [actions.fetchTokenStarted]: state => ({
      ...state,
      isFetchingToken: true,
      fetchTokenError: null,
    }),

    [actions.fetchTokenFailed]: (state, { payload }) => ({
      ...state,
      isFetchingToken: false,
      fetchTokenError: parseAxiosError(payload.error),
    }),

    [actions.fetchUserStarted]: state => ({
      ...state,
      isFetchingUser: true,
      fetchUserError: null,
    }),

    [actions.fetchUserFailed]: (state, { payload }) => ({
      ...state,
      isFetchingUser: false,
      fetchUserError: parseAxiosError(payload.error),
    }),

    [actions.needsNewAccessToken]: (state, { payload }) => ({
      ...state,
      needsNewAccessToken: true,
      isUnlocked: false,
    }),
  },
  initialState,
)

const getConfig = store => ({
  key: 'auth',
  storage: reduxPersistStorageAdapter(
    new CookieStorage({
      cookies: store.custom.cookies,
      expiration: {
        default: 365 * 86400, // Cookies expire after one year
      },
    }),
  ),
  whitelist: ['accessToken'],
  debug: false,
})

export default store => persistReducer(getConfig(store), authReducer)
