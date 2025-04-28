import { NextResponse, NextRequest } from 'next/server'

// Remove logging here as it didn't show up
// console.log(`GITHUB_PAT value read: ...`)

async function fetchGitHubAPI(path: string, token: string | undefined) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  }
  // Log whether the token was *received* by the function
  console.log(`Inside fetchGitHubAPI - received token is defined: ${!!token}`)
  if (token) {
    headers['Authorization'] = `token ${token}` // Use the passed token
    console.log('Authorization header added using passed token.')
  } else {
    console.log('Authorization header NOT added because passed token is missing.')
  }

  const url = `https://api.github.com${path}`
  console.log(`Fetching from GitHub API: ${url}`)

  try {
    const response = await fetch(url, { 
      headers, 
      // Consider adding caching/revalidation here for the external API call
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
      console.error(`GitHub API Error (${url}): ${response.status} ${response.statusText}`)
      const errorBody = await response.text()
      console.error(`GitHub API Error Body: ${errorBody}`)
      return { error: `GitHub API Error: ${response.statusText}`, status: response.status }
    }
    return await response.json()
  } catch (error: any) {
    console.error(`Network error fetching GitHub API (${url}):`, error)
    return { error: `Network error: ${error.message}`, status: 500 }
  }
}

export async function GET(request: NextRequest) {
  // Simplest possible log to check if the handler is entered
  console.log("API Route /api/github GET handler started")

  // Read the environment variable *inside* the handler
  const githubToken = process.env.GITHUB_PAT
  // Log whether the token is defined *within the handler scope*
  console.log(`Inside GET handler - GITHUB_PAT is defined: ${!!githubToken}`)

  const { searchParams } = new URL(request.url)
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')
  const what = searchParams.get('what') || 'stars' // Default to fetching stars

  if (!owner) {
    return NextResponse.json({ error: 'Missing owner parameter' }, { status: 400 })
  }

  let data: any
  let apiPath: string

  try {
    switch (what) {
      case 'stars':
        if (!repo) return NextResponse.json({ error: 'Missing repo parameter for stars' }, { status: 400 })
        apiPath = `/repos/${owner}/${repo}`
        // Pass the token read within the handler
        data = await fetchGitHubAPI(apiPath, githubToken)
        if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
        return NextResponse.json({ stars: data.stargazers_count ?? 0 })

      case 'followers':
        apiPath = `/users/${owner}`
        // Pass the token read within the handler
        data = await fetchGitHubAPI(apiPath, githubToken)
        if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
        return NextResponse.json({ followers: data.followers ?? 0 })

      case 'contributors':
        if (!repo) return NextResponse.json({ error: 'Missing repo parameter for contributors' }, { status: 400 })
        apiPath = `/repos/${owner}/${repo}/contributors`
        // Pass the token read within the handler
        data = await fetchGitHubAPI(apiPath, githubToken)
        if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
        // Return simplified contributor data (can adjust as needed)
        const contributors = Array.isArray(data) ? data.map((c: any) => ({ 
          login: c.login,
          avatar_url: c.avatar_url,
          contributions: c.contributions,
          html_url: c.html_url
        })) : []
        return NextResponse.json(contributors)

      default:
        return NextResponse.json({ error: 'Invalid value for \'what\' parameter' }, { status: 400 })
    }
  } catch (error: any) {
    console.error(`Unexpected error in GET handler:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 