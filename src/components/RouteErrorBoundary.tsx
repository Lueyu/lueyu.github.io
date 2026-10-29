import { isRouteErrorResponse, Link, useRouteError } from "react-router"

const CHUNK_FAIL =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i

const RELOAD_FLAG = "site:chunk-reload"

function isChunkLoadError(err: unknown): boolean {
  if (!(err instanceof TypeError)) return false
  const message = err instanceof Error ? err.message : String(err)
  return CHUNK_FAIL.test(message)
}

export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(RELOAD_FLAG)
  } catch {
    // sessionStorage unavailable (private mode etc.) — the guard simply never trips
  }
}

/**
 * Root errorElement: a failed dynamic-import after a redeploy means the browser
 * is holding a stale page that references chunks whose hashes no longer exist
 * on the server. One hard reload pulls the fresh index and fixes the visitor
 * transparently; the sessionStorage guard keeps a persistently broken deploy
 * from turning into a reload loop, and successful navigations clear the flag
 * (see RouteFrame).
 */
export default function RouteErrorBoundary() {
  const error = useRouteError()

  if (isChunkLoadError(error)) {
    try {
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1")
        window.location.reload()
        return null
      }
    } catch {
      // no sessionStorage — fall through to the manual error UI below
    }
  }

  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="not-found-page">
      <p>{notFound ? "ERROR 404" : "RUNTIME ERROR"}</p>
      <h1>
        {notFound ? (
          <>
            SECRET LEVEL
            <br />
            NOT FOUND.
          </>
        ) : (
          <>
            PAGE CRASHED.
            <br />
            TRY AGAIN.
          </>
        )}
      </h1>
      <div className="error-actions">
        <button
          className="pixel-button contact-button"
          onClick={() => window.location.reload()}
        >
          <span>RELOAD</span>
        </button>
        <Link className="pixel-button contact-button" to="/">
          <span>BACK TO HOME</span>
        </Link>
      </div>
    </main>
  )
}
