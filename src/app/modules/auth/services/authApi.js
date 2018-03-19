import qs from 'qs'
import { axios, extractData } from '../../../utils/apiResource'

export default {
  fetchToken: (data, axiosConfig) =>
    axios
      .post('/oauth/token', qs.stringify(data), {
        noAuth: true,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      })
      .then(extractData),

  fetchUser: (query, axiosConfig) =>
    axios.get('/me', { ...axiosConfig, params: query }).then(extractData),

  updateUser: (query, axiosConfig) =>
    axios.post('/me', data, axiosConfig).then(extractData),
}
