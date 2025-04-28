import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { ArrowUpRight, Star } from "lucide-react"
import Image from 'next/image'
import { formatCount } from '../../lib/utils'
import { Badge } from "../ui/badge"

// Refactored component accepting stars prop
const GitHubStarsButton = ({ org, repoName, stars }: { org: string; repoName: string; stars: number | null }) => {
  let displayStars: string = '-'

  if (stars !== null) {
    displayStars = formatCount(stars)
  } // Otherwise, default to '-' indicating error or loading issue during server fetch

  return (
    <Button variant="secondary" asChild>
      <a
        href={`https://github.com/${org}/${repoName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center min-w-[60px] justify-center"
      >
        <Star className="mr-1 h-4 w-4" />
        <span className="text-xs">{displayStars}</span>
      </a>
    </Button>
  )
}

// Export appsData so it can be imported elsewhere
export const appsData = [
  {
    title: "Ebb",
    description: "Take your focus to the next level on macOS.",
    websiteUrl: "https://ebb.cool",
    repoName: "ebb-app",
    icon: "/images/ebbAppIcon.png"
  },
  {
    title: "CodeClimbers CLI",
    description: "Track your time as a background process.",
    websiteUrl: "https://local.codeclimbers.io/install",
    repoName: "cli",
    icon: "/images/CodeClimbersAppIcon.png"
  },
]

async function getStars(owner: string, repo: string): Promise<number | null> {
  // Determine the base URL based on environment
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000' // Default to localhost if not on Vercel
  const apiUrl = `${baseUrl}/api/github?owner=${owner}&repo=${repo}`

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`Failed to fetch stars for ${owner}/${repo}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return typeof data.stars === 'number' ? data.stars : null
  } catch (error) {
    console.error(`Error fetching stars for ${owner}/${repo}:`, error)
    return null
  }
}

// Make Apps an async Server Component
export async function Apps() {
  const githubOrg = 'CodeClimbersIO'

  // Fetch stars for all apps concurrently
  const starsData = await Promise.all(
    appsData.map(app => getStars(githubOrg, app.repoName))
  )

  return (
    <section id="apps" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Our Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {appsData.map((app, index) => (
            <Card key={index} className="flex flex-col rounded-none">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 relative flex items-center justify-center">
                    <Image
                      src={app.icon}
                      alt={`${app.title} icon`}
                      width={80}
                      height={80}
                      className="object-contain"
                      style={{ height: 'auto' }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      {app.title}
                      {app.title === "Ebb" && <Badge className="bg-emerald-200 text-emerald-900 hover:bg-emerald-200/80">New</Badge>}
                    </CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button asChild>
                  <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <GitHubStarsButton org={githubOrg} repoName={app.repoName} stars={starsData[index]} />
              </CardFooter>
            </Card>
          ))}

          <Card className="flex flex-col border-dashed border-border/60 bg-secondary/30 rounded-none">
             <CardContent className="flex flex-col flex-grow items-center justify-center p-6 text-center">
               <h3 className="text-xl font-medium text-muted-foreground mb-2">More coming soon!</h3>
               <p className="text-sm text-muted-foreground/80 max-w-xs">We're always building new slop. Check back later for new additions.</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 