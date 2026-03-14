export default function Pagination({ currentPage, totalPages, totalRecords, perPage, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const showing = Math.min(currentPage * perPage, totalRecords)

  return (
    <div className="border border-[#F5F5F5] py-2 px-4 flex justify-between items-center">
      <p className="font-display text-[10px]">
        Showing <span className="font-bold">{showing}</span> of <span>{totalRecords}</span> records
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border border-[#EAEEF2] px-2.5 py-0.75 rounded-sm font-display text-sm text-[#9BA4BA] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2.5 py-0.75 rounded-sm font-display text-sm cursor-pointer
              ${page === currentPage
                ? 'border border-[#AABCB7] bg-[#F9F9F9] font-bold text-[#322C0F]'
                : 'border border-[#EAEEF2] text-[#9BA4BA]'
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border border-[#EAEEF2] px-2.5 py-0.75 rounded-sm font-display text-sm text-[#9BA4BA] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}