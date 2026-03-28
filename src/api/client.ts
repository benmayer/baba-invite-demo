/**
 * Mock API client.
 *
 * Simulates an async HTTP client with artificial network latency.
 * The router maps endpoint paths to fixture data, exactly as a
 * real backend would map routes to controllers.
 *
 * To swap in a real API: replace `resolve()` with a `fetch()` call
 * and remove the simulated latency. The service layer stays unchanged.
 */

import lobbyFixture from './fixtures/lobby.json';
import friendsFixture from './fixtures/friends.json';

// Simulated round-trip latency in milliseconds.
const SIMULATED_LATENCY_MS = 400;

/** Pause execution for a given number of milliseconds. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Route an endpoint path to its fixture data.
 * Throws a 404-style error for any unknown path,
 * mirroring how a real API would behave.
 */
function route(endpoint: string): unknown {
  if (endpoint.match(/^\/lobbies\/[^/]+$/)) {
    return lobbyFixture;
  }

  if (endpoint === '/friends') {
    return friendsFixture.friends;
  }

  if (endpoint.match(/^\/lobbies\/[^/]+\/invite\/[^/]+$/)) {
    // Simulate a successful invite response.
    const friendId = endpoint.split('/').pop() as string;
    return { friendId, success: true };
  }

  throw new Error(`[MockAPI] No fixture found for endpoint: ${endpoint}`);
}

/**
 * Perform a mock GET request.
 * Returns the fixture data for the given endpoint after a simulated delay.
 */
export async function get<T>(endpoint: string): Promise<T> {
  await delay(SIMULATED_LATENCY_MS);
  return route(endpoint) as T;
}

/**
 * Perform a mock POST request.
 * Returns the fixture response for the given endpoint after a simulated delay.
 * The `_body` parameter is accepted for API compatibility but unused in the mock.
 */
export async function post<T>(endpoint: string, _body?: unknown): Promise<T> {
  await delay(SIMULATED_LATENCY_MS);
  return route(endpoint) as T;
}
