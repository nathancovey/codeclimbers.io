import { NextResponse, NextRequest } from 'next/server'
import {
  getRepoContributors,
  getRepoStars,
  getUserFollowers,
} from '@/lib/github'

export async function GET(request: NextRequest) {

  const githubToken = process.env.GITHUB_PAT
  if (!githubToken) {
    console.error("API Route: GITHUB_PAT environment variable is not set.")
    return NextResponse.json(
      { error: 'GitHub token configuration error.' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')
  const what = searchParams.get('what') || 'stars'

  if (!owner) {
    console.error("[API Route] Missing owner parameter")
    return NextResponse.json({ error: 'Missing owner parameter' }, { status: 400 })
  }

  let data: any

  try {
    switch (what) {
      case 'stars':
        if (!repo) {
          console.error("[API Route] Missing repo parameter for stars")
          return NextResponse.json(
            { error: 'Missing repo parameter for stars' },
            { status: 400 }
          )
        }
        data = await getRepoStars(owner, repo, githubToken)
        if ('error' in data) {
          return NextResponse.json({ error: data.error }, { status: data.status })
        }
        return NextResponse.json({ stars: data.stargazers_count ?? 0 })

      case 'followers':
        data = await getUserFollowers(owner, githubToken)
        if ('error' in data) {
          return NextResponse.json({ error: data.error }, { status: data.status })
        }
        return NextResponse.json({ followers: data.followers ?? 0 })

      case 'contributors':
        if (!repo) {
          console.error("[API Route] Missing repo parameter for contributors")
          return NextResponse.json(
            { error: 'Missing repo parameter for contributors' },
            { status: 400 }
          )
        }
        data = await getRepoContributors(owner, repo, githubToken)
        if ('error' in data) {
          return NextResponse.json({ error: data.error }, { status: data.status })
        }
        // Ensure data is an array before mapping (already handled in lib)
        const contributors = data.map((c: any) => ({
          login: c.login,
          avatar_url: c.avatar_url,
          contributions: c.contributions,
          html_url: c.html_url,
        }))
        return NextResponse.json(contributors)

      default:
        console.error(
          `[API Route] Invalid value for 'what' parameter: ${what}`
        )
        return NextResponse.json(
          { error: "Invalid value for 'what' parameter" },
          { status: 400 }
        )
    }
  } catch (error: any) {
    // Catch unexpected errors during the process
    console.error("[API Route] Unexpected error:", error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 