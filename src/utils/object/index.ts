export const prefixObjectPropertyValue = (prefix: string, key: string): string => `${prefix}_${String(key)}`

export const unprefixObjectPropertyValue = (prefix: string, field: string):  string => {
  const match = field.match(new RegExp(`^${prefix}_(.+)$`))
  return match ? match[1] : field
}

export const indexObjectPropertyValue = (index: number, key: string) => 
  `${String(key)}${index > 0 ? `_${index + 1}` : ''}` 


export const unindexObjectPropertyValue = (field: string): string => {
  const match = field.match(/^(.+?)(?:_\d+)?$/)
  return match ? match[1] : field
}

export const objectHasPropertyValue = <T> (findingValue: unknown, object: Record<keyof T, unknown>): boolean => 
  Object.values(object).some(value => value === findingValue)
