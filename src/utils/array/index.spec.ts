import { mapArrayItemPropertiesValuesByKey } from '.'

describe('mapArrayItemPropertiesValuesByKey', () => {
  it('should return values for the given key from each object', () => {
    const data = [
      { a: 1, b: 2 },
      { a: 1, },
      { a: 1, b: 3 }
    ]

    const result = mapArrayItemPropertiesValuesByKey('a', data)
    expect(result).toEqual([ 1, 1, 1 ])
  })

  it('should skip objects that do not contain the key', () => {
    const data = [
      { a: 1, b: 2 },
      { a: 1, },
      { a: 1, b: 3 }
    ]

    const result = mapArrayItemPropertiesValuesByKey('b', data)
    expect(result).toEqual([ 2, 3 ])
  })

  it('should return an empty array if the input array is empty', () => {
    const result = mapArrayItemPropertiesValuesByKey('anyKey', [])
    expect(result).toEqual([])
  })

  it('should return undefined values if the key exists but value is undefined', () => {
    const data = [
      { a: 1, b: 2 },
      { a: 1, },
      { a: 1, b: undefined }    
    ]

    const result = mapArrayItemPropertiesValuesByKey('b', data)
    expect(result).toEqual([ 2, undefined ])
  })
})