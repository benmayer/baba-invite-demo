/**
 * LobbyDetailsCard component.
 * 
 * Horizontal card showing the lobby's core details:
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Lobby } from '../types/lobby';

type Props = {
  lobby: Lobby;
  onPress: () => void;
};

export function LobbyDetailsCard({ lobby, onPress }: Props) {
  const formattedDate = formatScheduledDate(lobby.scheduledAt);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open lobby: ${lobby.title}`}
    >
      {/* Sport emoji — vertically centred alongside the text block */}
      <Text style={styles.sportEmoji}>{lobby.sportEmoji}</Text>

      {/* Title + meta — takes all remaining horizontal space */}
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {lobby.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta} numberOfLines={1}>{'📅  '}{formattedDate}</Text>
          <Text style={styles.metaSeparator}>·</Text>
          <Text style={styles.meta} numberOfLines={1}>{'📍  '}{lobby.location}</Text>
        </View>
      </View>

      {/* Chevron — vertically centred on the right */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formats an ISO 8601 date string into the display format used in the design.
 * Example: "2026-04-02T18:00:00Z" → "Next Thurs, 2. April"
 */
function formatScheduledDate(isoString: string): string {
  const date = new Date(isoString);

  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });

  return `Next ${weekday}, ${day}. ${month}`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  sportEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: '#555555',
    flexShrink: 1,
  },
  metaSeparator: {
    fontSize: 13,
    color: '#BBBBBB',
    marginHorizontal: 6,
  },
  chevron: {
    fontSize: 22,
    color: '#AAAAAA',
    marginLeft: 8,
  },
});
