import { lineItemLabel, zeusSubtitle } from '../../components/pricing/labels'
import { vatShort } from '../../data/packages'
import { getTier, hasAddons, headlinePrice, lineItems, zeusTotal, ZEUS_FROM_PRICE, type ZeusSelection } from '../../data/pricing'
import { formatEuro, type Locale } from '../../i18n/locale'
import type { ServiceOption } from './fields'

/**
 * The visitor's choice as plain text. It is sent in front of the message, so
 * the inbox shows the exact package and add-ons whatever the backend's labels
 * say. Empty for choices the backend label already describes exactly.
 * `selection` = the Zeus add-ons (ignored for other choices).
 */
export function quoteSummary(service: ServiceOption | '', selection: ZeusSelection, locale: Locale): string {
  const fi = locale === 'fi'
  const heading = fi ? 'Valittu paketti' : 'Chosen package'
  const vat = vatShort[locale]

  if (service === 'zeus') {
    if (!hasAddons(selection)) {
      return `${heading}: Zeus – ${fi ? 'Apollo + lisäominaisuudet, alk.' : 'Apollo + add-ons, from'} ${formatEuro(ZEUS_FROM_PRICE, locale)} (${vat}). ${
        fi ? 'Lisäominaisuuksia ei vielä valittu.' : 'No add-ons chosen yet.'
      }`
    }
    const lines = lineItems(selection).map((item) => `• ${lineItemLabel(item, locale)}: ${formatEuro(item.amount, locale)}`)
    return [
      `${heading}: Zeus (${zeusSubtitle(selection, locale) ?? 'Apollo'})`,
      ...lines,
      `${fi ? 'Yhteensä' : 'Total'}: ${formatEuro(zeusTotal(selection), locale)} (${vat})`,
    ].join('\n')
  }
  if (service === 'hermes' || service === 'apollo') {
    const chosen = getTier(service)
    return `${heading}: ${chosen.name} – ${chosen.kind[locale]}, ${formatEuro(headlinePrice(service), locale)} (${vat})`
  }
  if (service === 'unsure') {
    return `${heading}: ${fi ? 'En osaa vielä sanoa – toivon suositusta sopivasta paketista.' : 'Not sure yet – I would like a recommendation.'}`
  }
  return ''
}
