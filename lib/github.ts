export type GitHubData = Record<string, any> | { error: string; status: number }

export interface Contributor {
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

export interface RepoInfo {
  stargazers_count?: number
}

export interface UserInfo {
  followers?: number
}

export async function fetchGitHubData(
  path: string,
  token: string | undefined
): Promise<GitHubData> {
  if (!token) {
    console.error('[lib/github] GitHub token was not provided.')
    return { error: 'Missing GitHub token', status: 500 }
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
    'User-Agent': 'codeclimbers-io-app',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const url = `https://api.github.com${path}`

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    })

    console.log(`[lib/github] Response Status for ${url}: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[lib/github] GitHub API Error (${url}): ${response.status} ${response.statusText}`)
      console.error(`[lib/github] GitHub API Error Body: ${errorBody}`)
      return { error: `GitHub API Error: ${response.statusText}`, status: response.status }
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`[lib/github] Network error fetching GitHub API (${url}):`, error)
    return { error: `Network error: ${error.message}`, status: 500 }
  }
}

export async function getRepoContributors(
  owner: string,
  repo: string,
  token?: string
): Promise<Contributor[] | { error: string; status: number }> {
  const data = await fetchGitHubData(`/repos/${owner}/${repo}/contributors`, token)
  if (typeof data === 'object' && data !== null && 'error' in data) {
    return data as { error: string; status: number }
  }
  return Array.isArray(data) ? (data as Contributor[]) : []
}

export async function getRepoStars(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoInfo | { error: string; status: number }> {
  const data = await fetchGitHubData(`/repos/${owner}/${repo}`, token)
  if (typeof data === 'object' && data !== null && 'error' in data) {
    return data as { error: string; status: number }
  }
  return data as RepoInfo
}

export async function getUserFollowers(
  owner: string,
  token?: string
): Promise<UserInfo | { error: string; status: number }> {
  const data = await fetchGitHubData(`/users/${owner}`, token)
  if (typeof data === 'object' && data !== null && 'error' in data) {
    return data as { error: string; status: number }
  }
  return data as UserInfo
} 