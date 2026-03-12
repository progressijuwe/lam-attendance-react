
export default function Info({ hour24, minute, dayName }){

    const isLate = () => {
        if (dayName === 'Sunday') {
        return hour24 > 7 || (hour24 === 7 && minute >= 15)
        }
        if (['Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(dayName)) {
        return hour24 > 17 || (hour24 === 17 && minute >= 30)
        }
        return null
    }

    const late = isLate()

    if (late === null) return null

    const styles = late
    ? 'border-[#EED3D3] bg-[#FFF9F9] text-[#DB3838]'
    : 'border-[#D3EED3] bg-[#F9FFF9] text-[#38DB38]'

    return(
        <div className={`flex justify-center w-full p-4 border ${styles}`}>
            <span className="font-display text-sm font-medium italic">
                {late
                    ? 'You are late today, Please come early next time'
                    : 'You are early, keep it up'}
            </span>
        </div>
    )
}