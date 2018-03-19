import { KEY } from './reducers'

export const getStateSlice = state => state[KEY]

export const getUser = state => getStateSlice(state).user

export const getAccessToken = state => getStateSlice(state).accessToken

export const getRefreshToken = state => getStateSlice(state).refreshToken

export const getIsLogged = state => !!getAccessToken(state)

export const getIsAuthenticated = getIsLogged

export const getIsFetchingToken = state => getStateSlice(state).isFetchingToken

export const getIsFetchingUser = state => getStateSlice(state).isFetchingUser

export const getFetchTokenError = state => getStateSlice(state).fetchTokenError

export const getIsLoading = state => getIsFetchingToken(state) || getIsFetchingUser(state)

export const getIsUnlocked = state => getStateSlice(state).isUnlocked

export const getIsUpdatingUser = state => getStateSlice(state).isUpdatingUser

export const getNeedsNewAccessToken = state => getStateSlice(state).needsNewAccessToken

export const getUserPermissions = (state) => {
  const user = getUser(state)

  return user && user.permissions ? user.permissions : []
}

export const getUserPermissionsNames = (state) => {
  const permissions = getUserPermissions(state)

  return permissions.length ? permissions.map(permission => permission.name) : []
}
