export const formatDateToBrazilianFormat = (date: string): string => {
  if (!date) 
    return ''
  
  const [ year, month, day ] = date.split('-')
  return `${day}/${month}/${year}`
}

export const formatDateToISO8601 = (date: string): string => {
  if (!date) 
    return ''
  
  const [ day, month, year ] = date.split('/')
  return `${year}-${month}-${day}`
}
