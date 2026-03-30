import FormSection from '../sections/home/FormSection'
import AttendanceGuard from "../sections/home/AttendanceGuard";
import TimeSection from '../sections/home/TimeSection'

export default function HomePage() {
  return (
    <>
      <TimeSection />
      <AttendanceGuard>
        <FormSection />
      </AttendanceGuard>
    </>
  )
}