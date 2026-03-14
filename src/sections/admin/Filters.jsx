import { useRef } from 'react'
import Search from '../../assets/svg/search.svg?react'
import Calendar from '../../assets/svg/calendar.svg?react'

export default function Filters({ onFilterChange }) {
    const dateRef = useRef(null)

    const handleChange = (key, value) => {
        onFilterChange(key, value)
    }
    return(
        <form className="p-4 flex flex-col md:flex-row items-center border-b border-[#F5F5F5] gap-2">
            <span className='w-full flex justify-between p-2 border border-[#E2E4EB] bg-[#F6F8FA] rounded-sm items-center'>
                <input 
                    type='input' 
                    id='table-search' 
                    placeholder='Search' 
                    className='font-display text-xs text-[#49526A]'
                    onChange={(e) => handleChange('search', e.target.value)}
                />
                <label htmlFor='table-search'><Search className='size-2.5' /></label>
            </span>
            <span className='w-full flex bg-[#F6F8FA] p-2 rounded-sm border border-[#E2E4EB]'>
                <select className='w-full text-[#49526A] font-display text-xs min-w-22' onChange={(e) => handleChange('department', e.target.value)}>
                    <option value="">All</option>
                    <option value="assimilation">Assimilation</option>
                    <option value="choir">Choir</option>
                    <option value="media">Media</option>
                    <option value="protocol">Protocol</option>
                    <option value="technical">Technical</option>
                    <option value="ushering">Ushering</option>
                </select>
            </span>
            <span className='w-full flex items-center bg-[#F6F8FA] p-2 rounded-sm border border-[#E2E4EB]' onClick={() => dateRef.current.showPicker()}>
                <input 
                    ref={dateRef}
                    type='date' 
                    id='table-date' 
                    className='text-[#49526A] w-full font-display text-xs'
                    onChange={(e) => handleChange('date', e.target.value)}
                />
                <label htmlFor='table-date'><Calendar /></label>
            </span>
        </form>
    )
}