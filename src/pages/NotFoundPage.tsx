import { Link } from "react-router"

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <p>ERROR 404</p>
      <h1>
        SECRET LEVEL
        <br />
        NOT FOUND.
      </h1>
      <Link className="pixel-button contact-button" to="/">
        <span>BACK TO HOME</span>
        <b aria-hidden="true">→</b>
      </Link>
    </main>
  )
}
