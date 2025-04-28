console.log("Loading /api/github/route.ts module...")

import { NextResponse, NextRequest } from 'next/server'

async function fetchGitHubAPI(path: string, token: string | undefined) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json'
  }
  // Log whether the token was *received* by the function
  console.log(`[DEV] Inside fetchGitHubAPI - received token defined: ${!!token}, length: ${token?.length ?? 0}`)
  if (token) {
    headers['Authorization'] = `token ${token}` // Use the passed token
    console.log('[DEV] Authorization header added using passed token.')
  } else {
    console.log('[DEV] Authorization header NOT added because passed token is missing.')
  }

  const url = `https://api.github.com${path}`
  console.log(`[DEV] Fetching from GitHub API URL: ${url}`)
  console.log(`[DEV] Fetching with Headers: ${JSON.stringify(headers)}`)

  try {
    const response = await fetch(url, { 
      headers, 
      // Consider adding caching/revalidation here for the external API call
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    console.log(`[DEV] GitHub Response Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      console.error(`GitHub API Error (${url}): ${response.status} ${response.statusText}`)
      const errorBody = await response.text()
      console.error(`GitHub API Error Body: ${errorBody}`)
      return { error: `GitHub API Error: ${response.statusText}`, status: response.status }
    }
    const responseData = await response.json()
    console.log("[DEV] GitHub Response Data (partial):", JSON.stringify(responseData).substring(0, 200) + "...") // Log partial success data
    return responseData
  } catch (error: any) {
    console.error(`Network error fetching GitHub API (${url}):`, error)
    return { error: `Network error: ${error.message}`, status: 500 }
  }
}

export async function GET(request: NextRequest) {
  // Wrap entire handler body in try...catch
  try {
    // Simplest possible log to check if the handler is entered
    console.log("API Route /api/github GET handler started")

    // Read the environment variable *inside* the handler
    const githubToken = process.env.GITHUB_PAT
    // Log whether the token is defined *within the handler scope*
    console.log(`[DEV] Inside GET handler - GITHUB_PAT is defined: ${!!githubToken}, length: ${githubToken?.length ?? 0}`)

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')
    const what = searchParams.get('what') || 'stars' // Default to fetching stars

    console.log(`[DEV] API Route /api/github received params: owner=${owner}, repo=${repo}, what=${what}`)

    if (!owner) {
      console.error("API Route /api/github: Missing owner parameter") // Log error before returning
      return NextResponse.json({ error: 'Missing owner parameter' }, { status: 400 })
    }

    let data: any
    let apiPath: string

    // Keep the inner try...catch for fetchGitHubAPI errors
    try {
      switch (what) {
        case 'stars':
          if (!repo) {
            console.error("API Route /api/github: Missing repo parameter for stars") // Log error
            return NextResponse.json({ error: 'Missing repo parameter for stars' }, { status: 400 })
          }
          apiPath = `/repos/${owner}/${repo}`
          data = await fetchGitHubAPI(apiPath, githubToken)
          if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
          return NextResponse.json({ stars: data.stargazers_count ?? 0 })

        case 'followers':
          apiPath = `/users/${owner}`
          data = await fetchGitHubAPI(apiPath, githubToken)
          if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
          return NextResponse.json({ followers: data.followers ?? 0 })

        case 'contributors':
          if (!repo) {
            console.error("API Route /api/github: Missing repo parameter for contributors") // Log error
            return NextResponse.json({ error: 'Missing repo parameter for contributors' }, { status: 400 })
          }
          apiPath = `/repos/${owner}/${repo}/contributors`
          data = await fetchGitHubAPI(apiPath, githubToken)
          if (data.error) return NextResponse.json({ error: data.error }, { status: data.status || 500 })
          const contributors = Array.isArray(data) ? data.map((c: any) => ({ 
            login: c.login,
            avatar_url: c.avatar_url,
            contributions: c.contributions,
            html_url: c.html_url
          })) : []
          return NextResponse.json(contributors)

        default:
          console.error(`API Route /api/github: Invalid value for 'what' parameter: ${what}`) // Log error
          return NextResponse.json({ error: 'Invalid value for \'what\' parameter' }, { status: 400 })
      }
    } catch (fetchError: any) {
      // Log errors from within the fetchGitHubAPI call or processing
      console.error(`API Route /api/github: Error during data fetching/processing:`, fetchError)
      return NextResponse.json({ error: 'Internal Server Error during fetch' }, { status: 500 })
    }

  } catch (handlerError: any) {
    // Catch any synchronous errors at the top level of the handler
    console.error("API Route /api/github: Top-level handler error:", handlerError)
    // Return a generic error response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 