import { useEffect, useLayoutEffect, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router'
import App from './App'
import AgentPanel from './components/AgentPanel'
import PageLens from './components/PageLens'
import RouteErrorBoundary, { clearChunkReloadFlag } from './components/RouteErrorBoundary'
import InterviewTour from './components/InterviewTour'
import { registerRouter } from './lib/agentTools'

function RouteFrame() {
  const { pathname, hash } = useLocation()
  const [showTour, setShowTour] = useState(false)
  const routerNavigate = useNavigate()

  useLayoutEffect(() => {
    clearChunkReloadFlag()
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
        behavior: 'instant' as ScrollBehavior,
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, hash])

  useEffect(() => {
    const onStartTour = () => setShowTour(true)
    window.addEventListener('lueyu-agent:start-tour', onStartTour)
    return () => window.removeEventListener('lueyu-agent:start-tour', onStartTour)
  }, [])

  return (
    <>
      <Outlet />
      <AgentPanel />
      <PageLens />
      {showTour && (
        <InterviewTour
          onClose={() => setShowTour(false)}
          navigate={async (to) => {
            await routerNavigate(to)
          }}
        />
      )}
    </>
  )
}

const router = createBrowserRouter([
  {
    Component: RouteFrame,
    HydrateFallback: () => null,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', Component: App },
      {
        path: '/projects/aidr',
        lazy: async () => ({
          Component: (await import('./pages/AidrPage')).default,
        }),
      },
      {
        path: '/projects/daily-portfolio',
        lazy: async () => ({
          Component: (await import('./pages/DailyPortfolioPage')).default,
        }),
      },
      {
        path: '/projects/:projectId',
        lazy: async () => ({
          Component: (await import('./pages/ProjectDetailPage')).default,
        }),
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('./pages/NotFoundPage')).default,
        }),
      },
    ],
  },
])

registerRouter(router)

export default function SiteRoutes() {
  return <RouterProvider router={router} />
}
