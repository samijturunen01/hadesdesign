import { processSteps } from '../data/content'
import { useT } from '../i18n/locale'
import { stagger } from '../lib/motion'

/** The five-step process as a timeline whose ember line draws itself on scroll. */
export function Process() {
  const t = useT()
  return (
    <ol className="process">
      {processSteps.map((step, i) => (
        <li key={step.title.fi} className="process__step" data-reveal="" style={stagger(i)}>
          <span className="process__node" aria-hidden="true" />
          <span className="card-index">0{i + 1}</span>
          <h3>{t(step.title)}</h3>
          <p className="muted">{t(step.text)}</p>
        </li>
      ))}
    </ol>
  )
}
