import { QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import './plugins/assets'
import App from './App.tsx'
import FallbackRender from './components/ErrorBoundary.tsx'
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupNProgress } from './plugins'
import { queryClient } from './service/queryClient'

function setupApp() {
  const container = document.getElementById('root')
  if (!container) return

  createRoot(container).render(
    <ErrorBoundary fallbackRender={FallbackRender}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  )

  setupNProgress()
  setupIconifyOffline()
  setupDayjs()
  setupAppVersionNotification()
}

setupApp()
