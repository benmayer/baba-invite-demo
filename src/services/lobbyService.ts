/**
 * Lobby service.
 *
 * Handles all data operations related to lobbies.
 * Components should never call the API client directly —
 * all API interaction goes through a service.
 */

import * as client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { Lobby } from '../types/lobby';

/**
 * Fetch a lobby by its ID.
 */
export async function getLobby(lobbyId: string): Promise<Lobby> {
  return client.get<Lobby>(ENDPOINTS.getLobby(lobbyId));
}
