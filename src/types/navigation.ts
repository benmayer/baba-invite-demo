/**
 * Navigation type definitions.
 *
 * Defines the param list for the root stack navigator.
 * Each key is a screen name; the value is its route params (or undefined).
 */

import { LobbyMember } from './lobby';

export type RootStackParamList = {
  /**
   * newMembers is set by InviteFriendsScreen when the user confirms
   * an invite, so LiveLobbyScreen can merge them into the member list.
   */
  LiveLobby: { lobbyId: string; newMembers?: LobbyMember[] };
  InviteFriends: { lobbyId: string };
};
