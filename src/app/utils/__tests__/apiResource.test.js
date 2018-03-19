import { createApiResource, extractData } from '../apiResource'

describe('apiResource', () => {
  describe('createApiResource', () => {
    it('should create an API resource with right interface', () => {
      const apiResource = createApiResource('/foo')

      expect(typeof apiResource.deleteById).toEqual('function')
      expect(typeof apiResource.fetchById).toEqual('function')
      expect(typeof apiResource.fetchMany).toEqual('function')
      expect(typeof apiResource.save).toEqual('function')
      expect(typeof apiResource.updateById).toEqual('function')
    })
  })

  describe('extractData', () => {
    it('should extract data attribute from object', () => {
      const response = {
        status: 200,
        data: {
          foo: 'bar',
        },
        baz: 'quox',
      }

      expect(extractData(response)).toEqual(response.data)
    })
  })
})
