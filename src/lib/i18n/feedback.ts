/**
 * Redacción de los avisos de la partida (resultado de cada acción), para el toast.
 * Función pura: recibe las funciones de traducción del idioma activo.
 */
import type { Feedback } from '../stores/game'
import type { Locale } from './core'
import type { Translate, TranslatePlural } from './index'
import type { ToastTone } from '../stores/toast'

export interface FeedbackMessage {
  readonly text: string
  readonly tone: ToastTone
}

/** Avisos que indican que algo no se ha podido hacer. */
const ERROR_KINDS: ReadonlySet<Feedback['kind']> = new Set(['no-symbol-held', 'rejected', 'symbol-unavailable'])

export function feedbackMessage(feedback: Feedback, t: Translate, tn: TranslatePlural, locale: Locale): FeedbackMessage {
  return { text: feedbackText(feedback, t, tn, locale), tone: ERROR_KINDS.has(feedback.kind) ? 'error' : 'info' }
}

function feedbackText(feedback: Feedback, t: Translate, tn: TranslatePlural, locale: Locale): string {
  switch (feedback.kind) {
    case 'no-symbol-held':
      return t('feedback.no-symbol-held')
    case 'rejected':
      return t(`feedback.${feedback.error}`, {
        statue: t(`statue.ref.${feedback.deposit.slot}`),
        symbol: t(`symbol.ref.${feedback.deposit.symbol}`),
      })
    case 'marked':
      return t('feedback.marked', {
        statue: t(`statue.ref.${feedback.deposit.slot}`),
        symbol: t(`symbol.ref.${feedback.deposit.symbol}`),
      })
    case 'swapped':
      return t('feedback.swapped', {
        firstSymbol: t(`symbol.ref.${feedback.swap.first.symbol}`),
        firstStatue: t(`statue.ref.${feedback.swap.first.slot}`),
        secondSymbol: t(`symbol.ref.${feedback.swap.second.symbol}`),
        secondStatue: t(`statue.ref.${feedback.swap.second.slot}`),
      })
    case 'symbol-unavailable':
    case 'knight-defeated':
      return t(`feedback.${feedback.kind}`, { symbol: t(`symbol.ref.${feedback.symbol}`) })
    case 'expired': {
      const names = feedback.symbols.map((symbol) => t(`symbol.ref.${symbol}`))
      const symbols = new Intl.ListFormat(locale, { type: 'conjunction' }).format(names)
      return tn('feedback.expired', names.length, { symbols })
    }
    case 'ogres-appeared':
    case 'knights-returned':
      return t(`feedback.${feedback.kind}`)
  }
}
