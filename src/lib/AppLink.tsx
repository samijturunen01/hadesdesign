import type { AnchorHTMLAttributes, MouseEvent, Ref } from 'react'
import { Link } from 'react-router'
import { preloadPath } from '../pages/registry'
import { useAppNavigate } from './useAppNavigate'

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  replace?: boolean
  ref?: Ref<HTMLAnchorElement>
}

const pathOf = (to: string) => to.split('#')[0] || '/'

/**
 * Internal link: a real <a href> (crawlers, new tabs, no-JS), with preloading
 * on hover/focus and an animated view-transition navigation on click.
 */
export function AppLink({ to, replace, onClick, onPointerEnter, onFocus, target, ...rest }: AppLinkProps) {
  const navigate = useAppNavigate()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || event.button !== 0 || modified || (target && target !== '_self')) return
    event.preventDefault()
    void navigate(to, { replace })
  }

  return (
    <Link
      to={to}
      target={target}
      onClick={handleClick}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        void preloadPath(pathOf(to))
      }}
      onFocus={(event) => {
        onFocus?.(event)
        void preloadPath(pathOf(to))
      }}
      {...rest}
    />
  )
}
