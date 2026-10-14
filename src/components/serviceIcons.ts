import type { ServicePageId } from '../routes'
import type { IconName } from './Icon'

export const SERVICE_ICONS: Record<ServicePageId, IconName> = {
  websites: 'devices',
  ecommerce: 'cart',
  redesign: 'refresh',
  maintenance: 'server',
}
