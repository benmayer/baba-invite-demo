/**
 * Types for the Lobby domain.
 *
 * A Lobby represents a sports session that players can join.
 * These types mirror the shape of the API response.
 */

export type LobbyStatus = 'open' | 'closed' | 'full';

export type LobbyMember = {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
};

export type Lobby = {
  id: string;
  /** User-defined name for the lobby, e.g. "Weekly Ping Pong Stars meet-up". */
  title: string;
  /** Emoji representing the sport, used in place of an icon. */
  sportEmoji: string;
  location: string;
  /** ISO 8601 date-time string for when the session starts. */
  scheduledAt: string;
  status: LobbyStatus;
  capacity: number;
  members: LobbyMember[];
};
