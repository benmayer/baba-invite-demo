/**
 * API endpoint constants.
 *
 * Centralising endpoint strings for quick overview of 
 * every endpoint available.
 */

export const ENDPOINTS = {
  /** Fetch the active lobby for a given lobby ID. */
  getLobby: (lobbyId: string) => `/lobbies/${lobbyId}`,

  /** Fetch the current user's friends list. */
  getFriends: () => `/friends`,

  /** Invite a friend to a lobby. */
  inviteFriend: (lobbyId: string, friendId: string) =>
    `/lobbies/${lobbyId}/invite/${friendId}`,
} as const;
