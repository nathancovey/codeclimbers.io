import { NextResponse, NextRequest } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_PAT

async function fetchGitHubAPI(path: string) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
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
        data = await fetchGitHubAPI(apiPath)
        if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
        return NextResponse.json({ stars: data.stargazers_count ?? 0 })

      case 'followers':
        apiPath = `/users/${owner}`
        data = await fetchGitHubAPI(apiPath)
        if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
        return NextResponse.json({ followers: data.followers ?? 0 })

      case 'contributors':
        if (!repo) return NextResponse.json({ error: 'Missing repo parameter for contributors' }, { status: 400 })
        apiPath = `/repos/${owner}/${repo}/contributors`
        // Fetch full contributor list, might need pagination for large repos
        data = await fetchGitHubAPI(apiPath)
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