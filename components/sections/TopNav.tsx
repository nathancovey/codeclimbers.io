import { Button } from '../ui/button'
import { Github } from 'lucide-react'
import { CodeClimbersLogo } from '../icons/CodeClimbersLogo'
import { formatCount } from '../../lib/utils'
import { getUserFollowers } from '@/lib/github'

export async function TopNav() {
  const orgName = 'CodeClimbersIO'
  const githubToken = process.env.GITHUB_PAT

  let followersCount: number | null = null

  if (githubToken) {
    const data = await getUserFollowers(orgName, githubToken)
    if (typeof data === 'object' && data !== null && !('error' in data)) {
      followersCount = data.followers ?? null
    } else if (typeof data === 'object' && data !== null && 'error' in data) {
      console.error(
        `[TopNav] Failed to fetch followers for ${orgName}: ${data.error}`
      )
    }
  } else {
    console.error('[TopNav] GITHUB_PAT environment variable is not set.')
  }

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