/**
 * Friends service.
 *
 * Handles all data operations related to friends and invitations.
 * Components should never call the API client directly —
 * all API interaction goes through a service.
 */

import * as client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Friend, InviteResult } from '../types/friend';

/**
 * Fetch the current user's friends list.
 */
export async function getFriends(): Promise<Friend[]> {
  return client.get<Friend[]>(ENDPOINTS.getFriends());
}

/**
 * Invite a friend to a lobby.
 */
export async function inviteFriend(
  lobbyId: string,
  friendId: string
): Promise<InviteResult> {
  return client.post<InviteResult>(ENDPOINTS.inviteFriend(lobbyId, friendId));
}
