import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import Calendar from '../../assets/svg/calendar.svg?react'
import ArrowDown from '../../assets/svg/arrow-down.svg?react'

export default function Welcome() {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)

    const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i + 1).reverse()

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false)
        }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const navigate = useNavigate()

    const handleLogout = async () => {
        await api.post('/api/logout')
        localStorage.removeItem('token')
        navigate('/login')
    }

  return (
    <div className="p-4 flex justify-between items-center border-b border-[#E2E4EB]">
        <div className="flex flex-col gap-2">
            <h1 className="text-xl font-body text-[#141414]">
            Welcome, <span className="font-bold">Admin</span>
            </h1>
            <span className="font-display text-[10px] bg-[#F6F8FA] border-[0.5px] border-[#E2E4EB] uppercase w-fit p-1 rounded-sm">
            Super Admin
            </span>
        </div>
        <div className='flex flex-col-reverse gap-2 items-end'>
            <div className="flex gap-2 relative" ref={dropdownRef}>
                <span className="flex items-center gap-2 p-2 bg-[#F6F8FA] border-[#CCD0DC] border-[0.6px] h-fit">
                <p className='font-display font-semibold text-[#050505] text-sm'>{selectedYear}</p>
                <span className='w-[0.6px] h-4 bg-[#CCD0DC]'></span>
                <Calendar className='size-4' />
                </span>

                <button
                className='p-2 flex items-center border-[0.6px] border-[#CCD0DC]'
                type='button'
                onClick={() => setOpen(prev => !prev)}
                >
                <ArrowDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E4EB] shadow-sm z-10 min-w-24">
                    {years.map(year => (
                    <button
                        key={year}
                        type='button'
                        onClick={() => { setSelectedYear(year); setOpen(false) }}
                        className={`w-full text-left px-4 py-2 font-display text-sm hover:bg-[#F6F8FA] cursor-pointer
                        ${year === selectedYear ? 'font-bold text-[#050505]' : 'text-[#49526A]'}`}
                    >
                        {year}
                    </button>
                    ))}
                </div>
                )}
            </div>
            <button
                onClick={handleLogout}
                type="button"
                className="font-display text-xs text-[#DB3838] border border-[#DB3838] px-3 py-1"
                >
                Logout
            </button>
        </div>
    </div>
  )
}