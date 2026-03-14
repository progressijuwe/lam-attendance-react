import { useState, useEffect } from 'react'
import api from '../lib/api'
import AttendanceTable from '../sections/admin/AttendanceTable'
import Filters from '../sections/admin/Filters'
import Pagination from '../sections/admin/Pagination'
import Welcome from '../sections/admin/Welcome'

const PER_PAGE = 10

export default function AdminPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ search: '', department: '', date: '' })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    api.get('/api/attendance')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load attendance records.'))
      .finally(() => setLoading(false))
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // reset to page 1 when filter changes
  }

  const filtered = data.filter(entry => {
    const matchesSearch =
      entry.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      entry.last_name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesDepartment = !filters.department || entry.department === filters.department
    const matchesDate = !filters.date || entry.date === filters.date
    return matchesSearch && matchesDepartment && matchesDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <section className="w-full bg-white lg:bg-[#E2E4EB] lg:p-4">
      <div className="border border-[#E2E4EB] bg-white">
        <Welcome />
        <Filters onFilterChange={handleFilterChange} />
        {error && (
          <p className="text-center text-sm text-red-500 py-6">{error}</p>
        )}
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-10">Loading...</p>
        ) : (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={filtered.length}
              perPage={PER_PAGE}
              onPageChange={setCurrentPage}
            />
            <AttendanceTable data={paginated} />
          </>
        )}
      </div>
    </section>
  )
}