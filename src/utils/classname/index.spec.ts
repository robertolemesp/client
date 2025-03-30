import { mergeClassNames } from '.'

describe('mergeClassNames (Unit)', () => {
  it('merges multiple class names correctly', () => {
    const result = mergeClassNames('text-red-500', 'font-bold', 'bg-blue-500')
    expect(result).toBe('text-red-500 font-bold bg-blue-500')
  })

  it('handles conditional class names', () => {
    const result = mergeClassNames('text-lg', false && 'hidden', 'hover:bg-gray-200')
    expect(result).toBe('text-lg hover:bg-gray-200')
  })

  it('removes duplicate classes', () => {
    const result = mergeClassNames('text-sm', 'text-sm', 'text-lg')
    expect(result).toBe('text-lg')
  })

  it('overrides conflicting Tailwind classes', () => {
    const result = mergeClassNames('text-blue-500', 'text-red-500')
    expect(result).toBe('text-red-500')
  })

  it('handles empty input', () => {
    const result = mergeClassNames()
    expect(result).toBe('')
  })
})
