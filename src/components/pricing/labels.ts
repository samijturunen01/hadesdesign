/** Wording shared by the Zeus calculator and the contact form's quote summary. */
import { addonCount, getAddon, PRICES, tierForSelection, type LineItem, type ZeusSelection } from '../../data/pricing'
import { formatEuro, type Locale } from '../../i18n/locale'

const plural = (n: number, locale: Locale, fi: [string, string], en: [string, string]) =>
  `${n} ${(locale === 'fi' ? fi : en)[n === 1 ? 0 : 1]}`

export const addonsLabel = (n: number, locale: Locale) =>
  plural(n, locale, ['lisäominaisuus', 'lisäominaisuutta'], ['add-on', 'add-ons'])

export const languagesLabel = (n: number, locale: Locale) =>
  plural(n, locale, ['lisäkieli', 'lisäkieltä'], ['additional language', 'additional languages'])

export const apolloBaseLabel = { fi: 'Apollo-verkkosivusto', en: 'Apollo website' }
export const languagesName = { fi: 'Lisäkielet', en: 'Additional languages' }

/** "Apollo-verkkosivusto", "Verkkomaksut", "Lisäkielet (2 × 100 €)" … */
export function lineItemLabel(item: LineItem, locale: Locale): string {
  if (item.id === 'apollo') return apolloBaseLabel[locale]
  if (item.id === 'languages') return `${languagesName[locale]} (${item.quantity} × ${formatEuro(PRICES.language, locale)})`
  return getAddon(item.id).name[locale]
}

/** "Apollo + 2 lisäominaisuutta" for Zeus; null when nothing is added (it is plain Apollo then). */
export function zeusSubtitle(selection: ZeusSelection, locale: Locale): string | null {
  return tierForSelection(selection) === 'zeus' ? `Apollo + ${addonsLabel(addonCount(selection), locale)}` : null
}
