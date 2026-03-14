import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/api/login', values)
      localStorage.setItem('token', res.data.token)
      navigate('/admin')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F6F8FA]">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E2E4EB] p-8 flex flex-col gap-4 w-full max-w-sm"
      >
        <h1 className="font-body font-bold text-xl text-[#141414]">Admin Login</h1>

        <div className="flex flex-col gap-1">
          <label className="font-display text-xs text-[#49526A]">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="border border-[#D2E1DA] px-3 py-2 text-sm font-display"
            placeholder="youremail@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-display text-xs text-[#49526A]">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="border border-[#D2E1DA] px-3 py-2 text-sm font-display"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="font-display h-10 w-full text-sm font-semibold border bg-[#1DDF85] border-[#033B21] text-[#000000] cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      <Link to='/' className='text-center underline font-display text-sm'>Go to Home</Link>

      </form>
    </section>
  )
}