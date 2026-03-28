/**
 * LobbyCard component.
 *
 * Displays the lobby status badge, capacity, and member list.
 * Used on the Live Lobby screen to give context before the user
 * navigates to the Invite Friends screen.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Lobby, LobbyMember } from '../types/lobby';
import { Avatar } from './Avatar';

type Props = {
  lobby: Lobby;
};

export function LobbyCard({ lobby }: Props) {
  const filledSlots = lobby.members.length;
  const capacityLabel = `${filledSlots}/${lobby.capacity}`;

  return (
    <View style={styles.card}>
      {/* Header row: status badge + capacity */}
      <View style={styles.header}>
        <StatusBadge status={lobby.status} />
        <Text style={styles.capacity}>{capacityLabel}</Text>
      </View>

      <View style={styles.divider} />

      {/* Member list */}
      {lobby.members.map((member) => (
        <MemberRow key={member.id} member={member} />
      ))}

      {/* Empty slots */}
      {Array.from({ length: lobby.capacity - filledSlots }).map((_, index) => (
        <EmptySlot key={`empty-${index}`} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sub-components (private to this file)
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Lobby['status'] }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{status.toUpperCase()}</Text>
    </View>
  );
}

function MemberRow({ member }: { member: LobbyMember }) {
  return (
    <View style={styles.memberRow}>
      <Avatar name={member.name} avatarUrl={member.avatarUrl} size={36} />
      <View style={styles.memberText}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberBio}>
          {member.bio ?? 'No bio yet'}
        </Text>
      </View>
    </View>
  );
}

function EmptySlot() {
  return <View style={styles.emptySlot} />;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  capacity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D9D9D9',
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  memberText: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  memberBio: {
    fontSize: 12,
    color: '#888888',
  },
  emptySlot: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
    marginTop: 6,
  },
});
