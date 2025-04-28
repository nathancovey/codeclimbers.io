import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent } from '../ui/card'
import { XIcon } from '../icons/XIcon'
import { appsData } from './Apps'

// Define a type for the app data structure
interface AppData {
  title: string;
  description: string;
  websiteUrl: string;
  repoName: string;
  icon: string;
}

interface ContributorData {
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

const teamMembers = [
  { name: "Paul Hovley", role: "Co-Founder", avatar: "/images/paul.jpg", xProfile: "https://x.com/paulhovley" },
  { name: "Nathan Covey", role: "Co-Founder", avatar: "/images/nathan.jpg", xProfile: "https://x.com/nathan_covey" },
]

async function getContributors(owner: string, repo: string): Promise<ContributorData[]> {
  // Determine the base URL based on environment
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000' // Default to localhost if not on Vercel
  const apiUrl = `${baseUrl}/api/github?owner=${owner}&repo=${repo}&what=contributors`
  
  // Log the constructed API URL right before fetching
  console.log(`[Team Component] Fetching contributors from: ${apiUrl}`) 

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Or adjust caching as needed
    })

    if (!res.ok) {
      console.error(`Failed to fetch contributors for ${owner}/${repo}: ${res.status} ${res.statusText}`)
      return [] // Return empty array on fetch failure
    }

    const data: ContributorData[] = await res.json()
    // Optional: Limit the number of contributors displayed
    // return data.slice(0, 6)
    return data

  } catch (error) {
    console.error(`Error fetching contributors for ${owner}/${repo}:`, error)
    return [] // Return empty array on error
  }
}

export async function Team() {
  const owner = 'CodeClimbersIO'
  const repo = 'cli'

  // Fetch contributors for all apps concurrently
  const allContributorsNested = await Promise.all(
    appsData.map((app: AppData) => getContributors(owner, app.repoName))
  )

  // Aggregate contributors and sum contributions
  const aggregatedContributors: { [login: string]: ContributorData } = {}
  allContributorsNested.flat().forEach((c: ContributorData) => {
    if (aggregatedContributors[c.login]) {
      aggregatedContributors[c.login].contributions += c.contributions
    } else {
      aggregatedContributors[c.login] = { ...c } // Add new contributor
    }
  })

  // Convert map back to array, filter out bot, sort by contributions, and take top 9
  const sortedContributors = Object.values(aggregatedContributors)
    .filter(c => c.login !== 'github-actions[bot]') // Filter out the bot
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 9) // Limit to top 9 contributors

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="inline-block p-0.5 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-sm flex-shrink-0 w-16 h-16">
                  <Avatar className="w-full h-full rounded-full bg-card">
                    <AvatarImage src={member.avatar} alt={member.name} className="object-cover rounded-full"/>
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground/90 text-sm">{member.role}</p>
                    {member.xProfile && (
                      <a
                        href={member.xProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity hover:opacity-80 text-foreground"
                        title={`${member.name} on X`}
                      >
                        <XIcon className="text-lg leading-none" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Top Contributors</h3>
          {sortedContributors.length > 0 ? (
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
              {sortedContributors.map((c: ContributorData) => (
                <Card key={c.login} className="overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="px-6 py-4 flex items-center gap-5">
                    <div className="inline-block p-0.5 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-sm flex-shrink-0 w-12 h-12">
                      <Avatar className="w-full h-full rounded-full bg-card">
                        <AvatarImage src={c.avatar_url} alt={c.login} />
                        <AvatarFallback>{c.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-grow min-w-0">
                      <a 
                        href={c.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-semibold text-sm block truncate hover:underline"
                        title={c.login}
                      >
                        {c.login.length > 10 ? `${c.login.slice(0, 10)}...` : c.login}
                      </a>
                      <p className="text-xs text-muted-foreground">{c.contributions} contributions</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Could not load contributors.</div>
          )}
        </div>
      </div>
    </section>
  )
}