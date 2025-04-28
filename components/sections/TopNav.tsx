import { Button } from '../ui/button'
import { Github } from "lucide-react"
import { CodeClimbersLogo } from '../icons/CodeClimbersLogo'
import { formatCount } from '../../lib/utils'

// Function to fetch followers from the internal API route
async function getFollowers(owner: string): Promise<number | null> {
  // Determine the base URL based on environment
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000' // Default to localhost if not on Vercel
  const apiUrl = `${baseUrl}/api/github?owner=${owner}&what=followers`

  try {
    // Fetch using absolute path
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Adjust caching as needed
    })
    if (!res.ok) {
      console.error(`Failed to fetch followers for ${owner}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return typeof data.followers === 'number' ? data.followers : null
  } catch (error) {
    console.error(`Error fetching followers for ${owner}:`, error)
    return null
  }
}

export async function TopNav() {
  const orgName = 'CodeClimbersIO'

  const followersCount = await getFollowers(orgName)
  const displayFollowers = followersCount !== null ? formatCount(followersCount) : '-' 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="h-8 w-auto">
          <CodeClimbersLogo className="h-8 w-auto" />
        </a>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://github.com/${orgName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5"
          >
            <Github className="h-4 w-4" />
            <span className="text-xs font-medium w-8 text-center">
              {displayFollowers}
            </span>
          </a>
        </Button>
      </div>
    </nav>
  )
}