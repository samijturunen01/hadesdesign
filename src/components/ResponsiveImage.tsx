import { publicUrl } from '../config/site'
import images from '../generated/images.json'

const manifest: Record<string, { width: number; height: number; widths: number[] }> = images

interface Props {
  /** Base name from src/generated/images.json (run `npm run assets` to regenerate). */
  name: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}

/** AVIF + WebP <picture> with intrinsic dimensions (no layout shift). */
export function ResponsiveImage({ name, alt, sizes, className, priority = false }: Props) {
  const meta = manifest[name]
  if (!meta) throw new Error(`Unknown image "${name}" – run npm run assets`)
  const { width, height, widths } = meta
  const srcset = (ext: string) => widths.map((w) => `${publicUrl(`images/work/${name}-${w}.${ext}`)} ${w}w`).join(', ')
  const fallback = widths[Math.min(1, widths.length - 1)] ?? widths[0]
  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        className={className}
        src={publicUrl(`images/work/${name}-${fallback}.webp`)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  )
}
