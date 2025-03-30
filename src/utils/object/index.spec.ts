import { indexObjectPropertyValue, objectHasPropertyValue, prefixObjectPropertyValue, unindexObjectPropertyValue, unprefixObjectPropertyValue } from '.'

it('prefixes form field names', () => {
  expect(prefixObjectPropertyValue('a', 'b')).toBe('a_b')
})

it('unprefixes form field names', () => {
  expect(unprefixObjectPropertyValue('a', 'a_b')).toBe('b')
})

it('indexes form field names', () => {
  expect(indexObjectPropertyValue(0, 'a')).toBe('a')
  expect(indexObjectPropertyValue(1, 'a')).toBe('a_2')
})

it('unindexes form field names', () => {
  expect(unindexObjectPropertyValue('a')).toBe('a')
  expect(unindexObjectPropertyValue('a_2')).toBe('a')
})

it('verifies object has a given property value', () => 
  expect(objectHasPropertyValue('a', { a: 'a', b: 'b' })).toBe(true)
)

it('verifies object does not have a given property value', () => 
  expect(objectHasPropertyValue('c', { a: 'a', b: 'b' })).toBe(false)
)
