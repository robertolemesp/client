import { objectHasPropertyValue } from '@/utils/object'

export const mapArrayItemPropertiesValuesByKey = (key: string, array: Record<string, unknown>[]): unknown[] => 
  (!array || !Array.isArray(array) ? [] : array)
    .reduce<unknown[]>((acc, item) => {
      if (key in item) 
        acc.push(item[key])
      
      return acc
    }, [])

export const arrayHasSomeItemPropertyValue = <T> (key: string, array: Record<keyof T, unknown>[]): boolean => 
  (array || []).some(item => objectHasPropertyValue<T>(key, item)) 
