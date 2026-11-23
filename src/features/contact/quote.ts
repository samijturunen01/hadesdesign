import { lineItemLabel, zeusSubtitle } from '../../components/pricing/labels'
import { vatShort } from '../../data/packages'
import { getTier, headlinePrice, lineItems, quoteTotal, ZEUS_FROM_PRICE, type Quote, type TierId } from '../../data/pricing'
import { formatEuro, type Locale } from '../../i18n/locale'

/**
 * The chosen package as plain text. It is sent in front of the message, so the
 * inbox shows the exact package and add-ons whatever the backend's labels say.
 * `quote` is the configuration brought from the pricing page, if any.
 */
export function quoteSummary(tier: TierId, quote: Quote | null, locale: Locale): string {
  const fi = locale === 'fi'
  const heading = fi ? 'Valittu paketti' : 'Chosen package'
  const vat = vatShort[locale]

  if (tier === 'zeus' && quote?.tier === 'zeus') {
    const lines = lineItems(quote.selection).map((item) => `• ${lineItemLabel(item, locale)}: ${formatEuro(item.amount, locale)}`)
    return [
      `${heading}: Zeus (${zeusSubtitle(quote.selection, locale) ?? 'Apollo'})`,
      ...lines,
      `${fi ? 'Laskurin mukainen hinta' : 'Calculator price'}: ${formatEuro(quoteTotal(quote), locale)} (${vat})`,
    ].join('\n')
  }
  if (tier === 'zeus') {
    return `${heading}: Zeus – ${fi ? 'Apollo + lisäosat, alk.' : 'Apollo + add-ons, from'} ${formatEuro(ZEUS_FROM_PRICE, locale)} (${vat})`
  }
  const chosen = getTier(tier)
  return `${heading}: ${chosen.name} – ${chosen.kind[locale]}, ${formatEuro(headlinePrice(tier), locale)} (${vat})`
}
