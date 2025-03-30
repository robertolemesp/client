import HttpClient from '.'

describe('HttpClient', () => {
  it('should return the instance and its type an object', () => {
    const instance = HttpClient.getInstance()

    expect(instance).toBeDefined()
    expect(typeof instance).toBe('object')
  })
})
