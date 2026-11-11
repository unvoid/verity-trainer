import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, isLocale, resolveLocale, translate, type Messages } from '../../src/lib/i18n/core'
import { en } from '../../src/lib/i18n/en'
import { es } from '../../src/lib/i18n/es'

describe('dictionaries', () => {
  it('es and en define the same keys', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort())
  })

  it('no text is empty', () => {
    for (const text of [...Object.values(es), ...Object.values(en)]) {
      expect(text.trim()).not.toBe('')
    }
  })
})

describe('isLocale', () => {
  it('accepts supported locales only', () => {
    expect(isLocale('es')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(null)).toBe(false)
  })
})

describe('resolveLocale', () => {
  it('matches by primary language', () => {
    expect(resolveLocale(['es-ES'])).toBe('es')
    expect(resolveLocale(['EN-us'])).toBe('en')
  })

  it('takes the first supported preference', () => {
    expect(resolveLocale(['fr-FR', 'es-MX', 'en'])).toBe('es')
  })

  it('falls back when nothing matches', () => {
    expect(resolveLocale(['fr', 'de'])).toBe(DEFAULT_LOCALE)
    expect(resolveLocale([])).toBe(DEFAULT_LOCALE)
    expect(resolveLocale(['fr'], 'es')).toBe('es')
  })
})

describe('translate', () => {
  const messages = { ...es, 'app.tagline': 'Hola {name}, llevas {count} intercambios' } as Messages

  it('returns the plain text without params', () => {
    expect(translate(messages, 'app.title')).toBe(es['app.title'])
  })

  it('interpolates params', () => {
    expect(translate(messages, 'app.tagline', { name: 'Ana', count: 3 })).toBe(
      'Hola Ana, llevas 3 intercambios',
    )
  })

  it('keeps unknown placeholders visible', () => {
    expect(translate(messages, 'app.tagline', { name: 'Ana' })).toBe('Hola Ana, llevas {count} intercambios')
  })
})
