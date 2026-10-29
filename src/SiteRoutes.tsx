import { useLayoutEffect } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router'
import App from './App'
import AgentPanel from './components/AgentPanel'
import PageLens from './components/PageLens'
import { registerRouter } from './lib/agentTools'

function RouteFrame() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
        behavior: 'instant' as ScrollBehavior,
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, hash])

  return (
    <>
      <Outlet />
      <AgentPanel />
      <PageLens />
    </>
  )
}

const router = createBrowserRouter([
  {
    Component: RouteFrame,
    HydrateFallback: () => null,
    children: [
      { path: '/', Component: App },
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
