import { useEffect, useLayoutEffect, useState } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router'
import App from './App'
import AgentPanel from './components/AgentPanel'
import PageLens from './components/PageLens'
import RouteErrorBoundary, { clearChunkReloadFlag } from './components/RouteErrorBoundary'
import InterviewTour from './components/InterviewTour'
import SiteHeader from './components/SiteHeader'
import SiteSearch from './components/SiteSearch'
import { registerRouter } from './lib/agentTools'

function RouteFrame() {
  const { pathname, hash, key } = useLocation()
  const [showTour, setShowTour] = useState(false)
  const routerNavigate = useNavigate()

  useLayoutEffect(() => {
    clearChunkReloadFlag()
    if (pathname === '/' && (hash === '#about' || hash === '#experience')) {
      void routerNavigate('/blog', { replace: true })
      return
    }
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
        behavior: 'instant' as ScrollBehavior,
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, hash, key, routerNavigate])

  useEffect(() => {
    const onStartTour = () => setShowTour(true)
    window.addEventListener('lueyu-agent:start-tour', onStartTour)
    return () => window.removeEventListener('lueyu-agent:start-tour', onStartTour)
  }, [])

  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteSearch />
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
      { path: '/blog', lazy: async () => ({ Component: (await import('./pages/BlogPage')).default }) },
      { path: '/blog/:slug', lazy: async () => ({ Component: (await import('./pages/BlogPostPage')).default }) },
      { path: '/resume', lazy: async () => ({ Component: (await import('./pages/ResumePage')).default }) },
      { path: '/projects', lazy: async () => ({ Component: (await import('./pages/ProjectsPage')).default }) },
      {
        path: '/projects/aidr',
        lazy: async () => ({
          Component: (await import('./pages/AidrPage')).default,
        }),
      },
      {
        path: '/projects/squabble',
        lazy: async () => ({
          Component: (await import('./pages/SquabblePage')).default,
        }),
      },
      {
        path: '/projects/daily-portfolio',
        element: <Navigate to="/projects/squabble" replace />,
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
