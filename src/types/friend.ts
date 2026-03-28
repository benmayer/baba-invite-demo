/**
 * Types for the Friend domain.
 *
 * A Friend represents another user on the platform that the
 * current user can invite to a lobby.
 */

export type Friend = {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
};

/**
 * Represents the result of inviting a friend to a lobby.
 */
export type InviteResult = {
  friendId: string;
  success: boolean;
};
