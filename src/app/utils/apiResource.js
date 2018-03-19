import Axios from 'axios'
import Qs from 'qs'
import config from '../../../config/index'

const interpolate = (endpointTemplate, params) =>
  Object.keys(params).reduce(
    (endpoint, param) => endpoint.replace(`{${param}}`, params[param]),
    endpointTemplate,
  )

const baseURL = config('apiUrl')

export const axios = Axios.create({
  baseURL,
  paramsSerializer: params => Qs.stringify(params),
})

export const extractData = res => res.data

export function createApiResource(endpoint) {
  const setParams = params => createApiResource(interpolate(endpoint, params))

  const getEndpoint = (withBase = true) => `${withBase ? baseURL : ''}${endpoint}`

  const fetchMany = (query, axiosConfig) =>
    axios.get(endpoint, { ...axiosConfig, params: query }).then(extractData)

  const fetchById = (id, query, axiosConfig) =>
    axios.get(`${endpoint}/${id}`, { ...axiosConfig, params: query }).then(extractData)

  const save = (data, axiosConfig) =>
    axios.post(endpoint, data, axiosConfig).then(extractData)

  const updateById = (id, data, axiosConfig) =>
    axios.put(`${endpoint}/${id}`, data, axiosConfig).then(extractData)

  const deleteById = (id, axiosConfig) =>
    axios.delete(`${endpoint}/${id}`, axiosConfig).then(extractData)

  const deleteManyByIds = (ids, axiosConfig) =>
    Promise.all(ids.map(id => deleteById(id, axiosConfig)))

  return {
    setParams,
    getEndpoint,

    fetchMany,
    fetchById,
    save,
    create: save,
    updateById,
    deleteById,
    deleteManyByIds,
  }
}

export default createApiResource
