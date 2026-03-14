import { BASE_URL } from '../../lib/api'

export default function AttendanceTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="font-display text-sm text-[#49526A]">No records found</p>
      </div>
    )
  }
  return (
    <div>
      {/* DESKTOP — table */}
      <table className="hidden md:table w-full text-xs font-display">
        <thead>
          <tr className="border-b border-[#F5F5F5]">
            <th className="text-left p-3 font-medium text-[#49526A]">↑ Picture</th>
            <th className="text-left p-3 font-medium text-[#49526A]">↑ Time</th>
            <th className="text-left p-3 font-medium text-[#49526A]">↑ First Name</th>
            <th className="text-left p-3 font-medium text-[#49526A]">↑ Last Name</th>
            <th className="text-left p-3 font-medium text-[#49526A]">↑ Department</th>
            <th className="text-left p-3 font-medium text-[#49526A]">↑ Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id} className="border-b border-[#F5F5F5]">
              <td className="p-3">
                <img src={entry.picture_path} alt="" className="w-10 h-10 object-cover" />
              </td>
              <td className="p-3 text-[#49526A]">{entry.time}</td>
              <td className="p-3 capitalize">{entry.first_name}</td>
              <td className="p-3 capitalize">{entry.last_name}</td>
              <td className="p-3 capitalize">{entry.department}</td>
              <td className="p-3">
                <StatusBadge status={entry.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MOBILE — cards */}
      <div className="flex flex-col gap-4 md:hidden p-4">
        {data.map((entry) => (
          <div key={entry.id} className="border border-[#F5F5F5]">
            <div className="flex justify-center p-4 bg-[#E9ECEB]">
              <img src={entry.picture_path} alt="" className="w-24 h-24 object-cover" />
            </div>
            <div className="flex flex-col text-xs font-display">
              <Row label="Time"       value={entry.time} />
              <Row label="First Name" value={<span className="font-bold">{entry.first_name}</span>} />
              <Row label="Last Name"  value={<span className="font-bold">{entry.last_name}</span>} />
              <Row label="Department" value={<span className="font-bold">{entry.department}</span>} />
              <Row label="Status"     value={<StatusBadge status={entry.status} />} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex border-b border-[#F5F5F5]">
      <span className="w-28 p-2 text-[#49526A] bg-[#F6F8FA] border-r border-[#F5F5F5] shrink-0">
        {label}
      </span>
      <span className="p-2">{value}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const isLate = status === 'LATE'
  return (
    <span className={`px-2 py-0.5 text-xs border rounded-sm
      ${isLate
        ? 'text-[#DB3838] border-[#DB3838] bg-[#FFF9F9]'
        : 'text-[#038B45] border-[#038B45] bg-[#F0FFF7]'
      }`}>
      {isLate ? 'LATE' : 'ON - TIME'}
    </span>
  )
}