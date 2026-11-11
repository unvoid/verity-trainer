import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  isLocale,
  translate,
  translatePlural,
  type Messages,
} from '../../src/lib/i18n/core'
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

describe('DEFAULT_LOCALE', () => {
  it('is English', () => {
    expect(DEFAULT_LOCALE).toBe('en')
  })
})

describe('translate', () => {
  const messages: Messages = { ...es, 'status.swaps': 'Hola {name}, llevas {count} intercambios' }

  it('returns the plain text without params', () => {
    expect(translate(messages, 'app.title')).toBe(es['app.title'])
  })

  it('interpolates params', () => {
    expect(translate(messages, 'status.swaps', { name: 'Ana', count: 3 })).toBe(
      'Hola Ana, llevas 3 intercambios',
    )
  })

  it('keeps unknown placeholders visible', () => {
    expect(translate(messages, 'status.swaps', { name: 'Ana' })).toBe('Hola Ana, llevas {count} intercambios')
  })
})

describe('translatePlural', () => {
  it('picks singular or plural per language rules and passes count', () => {
    expect(translatePlural(es, 'es', 'hint.remaining', 1)).toBe('Falta al menos 1 intercambio.')
    expect(translatePlural(es, 'es', 'hint.remaining', 3)).toBe('Faltan al menos 3 intercambios.')
    expect(translatePlural(en, 'en', 'hint.remaining', 1)).toBe('At least 1 swap left.')
    expect(translatePlural(en, 'en', 'hint.remaining', 0)).toBe('At least 0 swaps left.')
  })

  it('every .one key has its .other pair in both languages', () => {
    for (const dict of [es, en]) {
      const keys = Object.keys(dict)
      for (const key of keys.filter((k) => k.endsWith('.one'))) {
        expect(keys).toContain(key.replace(/\.one$/, '.other'))
      }
    }
  })
})
