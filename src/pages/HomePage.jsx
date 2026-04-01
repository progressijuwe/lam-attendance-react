import FormSection from '../sections/home/FormSection'
import { useLocationGuard } from '../hooks/useLocationGuard'
import AttendanceGuard from "../sections/home/AttendanceGuard";
import TimeSection from '../sections/home/TimeSection'

export default function HomePage() {

  const locationGuard = useLocationGuard()

  return (
    <>
      <TimeSection />
      <AttendanceGuard locationGuard={locationGuard}>
        <FormSection coords={locationGuard.coords} accuracy={locationGuard.accuracy} />
      </AttendanceGuard>
    </>
  )
}