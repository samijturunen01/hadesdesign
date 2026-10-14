import type { ReactNode } from 'react'
import { PageHero } from '../../components/ui'
import { AppLink } from '../../lib/AppLink'
import type { PageId } from '../../routes'
import type { LegalDocument } from './legalContent'

/** Turn "[label](href)" into links – internal paths use the app router. */
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  for (const match of text.matchAll(re)) {
    const [whole, label, href] = match
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(
      href?.startsWith('/') ? (
        <AppLink key={match.index} to={href}>
          {label}
        </AppLink>
      ) : (
        <a key={match.index} href={href} {...(href?.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
          {label}
        </a>
      ),
    )
    last = match.index + whole.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function LegalDocumentView({ id, doc }: { id: PageId; doc: LegalDocument }) {
  return (
    <>
      <PageHero id={id} title={doc.title} lead={doc.intro}>
        <p className="chip">{doc.updated}</p>
      </PageHero>
      <section className="section section--tight">
        <div className="container">
          <article className="prose">
            {doc.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((block, i) =>
                  Array.isArray(block) ? (
                    <ul key={i}>
                      {block.map((item) => (
                        <li key={item}>{inline(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{inline(block)}</p>
                  ),
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  )
}
