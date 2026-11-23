import type { AddonKey } from '../../data/pricing'
import type { IconName } from '../Icon'

export const ADDON_ICONS: Record<AddonKey, IconName> = {
  booking: 'calendar',
  payments: 'card',
  analytics: 'chart',
  languages: 'globe',
}
