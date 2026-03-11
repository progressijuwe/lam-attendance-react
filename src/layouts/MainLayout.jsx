// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import { Header } from '../sections/shared/Header'
import { Footer } from '../sections/shared/Footer'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}