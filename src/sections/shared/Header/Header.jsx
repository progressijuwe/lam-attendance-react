import { Link } from 'react-router-dom'
import logo from '../../../assets/images/lamlogo.png'

export function Header() {
  return (
    <header className="border-b border-[#FFBA41] p-4 flex items-center justify-between bg-linear-to-r from-[#FFF1D9] via-[#FFF098] to-[#FFF1D9]">
      <Link to="/" className="flex items-center gap-2.5">
        <img className='size-12 object-cover' src={logo} alt='Logo' />
        <h2 className='uppercase font-display font-bold text-base'>Lam Abuja</h2>
      </Link>
      <nav className="flex gap-6">
        <button type='button' className='flex flex-col justify-center items-center gap-1'>
          <span className="block w-6 h-1 bg-[#FFBA41]"></span>
          <span className="block w-6 h-1 bg-[#FFBA41]"></span>
          <span className="block w-6 h-1 bg-[#FFBA41]"></span>
        </button>
      </nav>
    </header>
  )
}