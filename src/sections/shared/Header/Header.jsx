import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">MyApp</Link>
      <nav className="flex gap-6">
        <Link to="/"      className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
      </nav>
    </header>
  )
}