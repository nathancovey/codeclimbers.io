import { TopNav } from '@/components/sections/TopNav'
import { Hero } from '@/components/sections/Hero'
import { Apps } from '@/components/sections/Apps'
import { Mission } from '../components/sections/Mission'
import { Team } from '@/components/sections/Team'
import { Footer } from '@/components/sections/Footer'

// Force dynamic rendering because child components fetch data dynamically
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-grow">
        <Hero />
        <Apps />
        <Team />
        <Mission />
      </main>
      <Footer />
    </div>
  )
}
