import { TopNav } from '@/components/sections/TopNav'
import { Footer } from '@/components/sections/Footer'
import { Button } from '@/components/ui/button'

// Make this an async component to allow awaiting TopNav if necessary
export default async function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page Not Found</p>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <a href="/">Go back home</a>
        </Button>
      </main>
      <Footer />
    </div>
  )
} 