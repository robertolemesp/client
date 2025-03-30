import { formatDateToBrazilianFormat, formatDateToISO8601 } from '.'

describe('formatDateToBrazilianFormat (Unit)', () => {
  it('formats a valid ISO date correctly to DD/MM/YYYY', () => {
    expect(formatDateToBrazilianFormat('1995-01-11')).toBe('11/01/1995')
    expect(formatDateToBrazilianFormat('2000-12-31')).toBe('31/12/2000')
  })

  it('returns empty string when input is falsy', () => {
    expect(formatDateToBrazilianFormat('')).toBe('')
  })
})

describe('formatDateToISO8601 (Unit)', () => {
  it('formats a valid Brazilian date correctly to YYYY-MM-DD', () => {
    expect(formatDateToISO8601('11/01/1995')).toBe('1995-01-11')
    expect(formatDateToISO8601('31/12/2000')).toBe('2000-12-31')
  })

  it('returns empty string when input is falsy', () => {
    expect(formatDateToISO8601('')).toBe('')
  })
})