// src/sections/home/HeroSection.jsx
import { Button } from '../../components/ui'

export function HeroSection() {
  return (
    <section className="px-6 py-24 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome</h1>
      <p className="text-gray-600 mb-8">Your project is ready.</p>
      <Button icon="arrow-right">Get started</Button>
    </section>
  )
}