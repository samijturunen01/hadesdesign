import { Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { LOCALES } from './i18n/locale'
import { Layout } from './layout/Layout'
import { onIdle } from './lib/motion'
import { loadAllPages, NotFoundPage, PAGES } from './pages/registry'
import { PAGE_IDS, PATHS } from './routes'

export default function App() {
  // Warm every page chunk once the browser is idle so navigation is instant.
  useEffect(() => onIdle(() => void loadAllPages()), [])

  return (
    <Layout>
      <Suspense fallback={<div className="page-fallback" aria-hidden="true" />}>
        <Routes>
          {PAGE_IDS.flatMap((id) =>
            LOCALES.map((locale) => {
              const Page = PAGES[id]
              return <Route key={`${id}:${locale}`} path={PATHS[id][locale]} element={<Page id={id} />} />
            }),
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
