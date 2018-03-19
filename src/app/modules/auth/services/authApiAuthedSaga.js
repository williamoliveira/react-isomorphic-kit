import { wrapAxiosMethodWithAuthSaga } from '../../../utils/apiResourceAuthWrapper'
import authApi from './authApi'

export default {
  ...authApi,
  fetchToken: wrapAxiosMethodWithAuthSaga(authApi.fetchToken, 1),
  fetchUser: wrapAxiosMethodWithAuthSaga(authApi.fetchUser, 1),
  updateUser: wrapAxiosMethodWithAuthSaga(authApi.updateUser, 1),
}
