// import { GITHUB_PAT } from './constants' // No longer importing PAT here

export type GitHubData = Record<string, any> | { error: string; status: number }

// Define specific types for expected data structures if possible
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

/**
 * Fetches data from the GitHub API.
 * Handles common headers and basic error handling.
 */
export async function fetchGitHubData(
  path: string,
  token: string | undefined // Removed default assignment
): Promise<GitHubData> {
  if (!token) {
    console.error('[lib/github] GitHub token was not provided.')
    return { error: 'Missing GitHub token', status: 500 }
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
    'User-Agent': 'codeclimbers-io-app', // Use a consistent User-Agent
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const url = `https://api.github.com${path}`
  console.log(`[lib/github] Fetching: ${url}`)
  // Avoid logging headers here as they contain the token

  try {
    const response = await fetch(url, {
      headers,
      // Use Next.js caching/revalidation features if called from components/routes
      // Adjust cache options as needed
      next: { revalidate: 60 }, // Example: Revalidate every 60 seconds
    })

    console.log(`[lib/github] Response Status for ${url}: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[lib/github] GitHub API Error (${url}): ${response.status} ${response.statusText}`)
      console.error(`[lib/github] GitHub API Error Body: ${errorBody}`)
      return { error: `GitHub API Error: ${response.statusText}`, status: response.status }
    }

    const data = await response.json()
    // console.log(`[lib/github] Response Data (partial) for ${url}:`, JSON.stringify(data).substring(0, 100) + '...')
    return data
  } catch (error: any) {
    console.error(`[lib/github] Network error fetching GitHub API (${url}):`, error)
    return { error: `Network error: ${error.message}`, status: 500 }
  }
}

// --- Specific fetch functions (optional, but good practice) ---

export async function getRepoContributors(
  owner: string,
  repo: string,
  token?: string
): Promise<Contributor[] | { error: string; status: number }> {
  const data = await fetchGitHubData(`/repos/${owner}/${repo}/contributors`, token)
  // Check if the fetched data is an error object
  if (typeof data === 'object' && data !== null && 'error' in data) {
    return data as { error: string; status: number } // Type assertion for the error case
  }
  // Otherwise, assume it's the contributor array (add more validation if needed)
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
  return data as RepoInfo // Assume RepoInfo otherwise
}

export async function getUserFollowers(
  owner: string,
  token?: string
): Promise<UserInfo | { error: string; status: number }> {
  const data = await fetchGitHubData(`/users/${owner}`, token)
  if (typeof data === 'object' && data !== null && 'error' in data) {
    return data as { error: string; status: number }
  }
  return data as UserInfo // Assume UserInfo otherwise
} 