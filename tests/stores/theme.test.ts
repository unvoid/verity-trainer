import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME, oppositeTheme, parseTheme } from '../../src/lib/stores/theme'

describe('theme', () => {
  it('starts light, like the game, unless the player chose dark', () => {
    expect(DEFAULT_THEME).toBe('light')
    expect(parseTheme(null)).toBe('light')
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('sepia')).toBe('light')
  })

  it('toggles to the opposite theme', () => {
    expect(oppositeTheme('light')).toBe('dark')
    expect(oppositeTheme('dark')).toBe('light')
  })
})
