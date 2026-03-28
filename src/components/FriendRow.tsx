/**
 * FriendRow component.
 *
 * A single row in the friends list on the Invite Friends screen.
 * Tapping the row toggles the friend's selected state, which is
 * reflected visually: a checkmark when selected, a chevron when not.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Friend } from '../types/friend';
import { Avatar } from './Avatar';

type Props = {
  friend: Friend;
  selected: boolean;
  onToggle: (friend: Friend) => void;
};

export function FriendRow({ friend, selected, onToggle }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={() => onToggle(friend)}
      accessibilityRole="checkbox"
      accessibilityLabel={`${friend.name}${friend.bio ? `, ${friend.bio}` : ''}`}
      accessibilityState={{ checked: selected }}
    >
      <Avatar name={friend.name} avatarUrl={friend.avatarUrl} size={40} />

      <View style={styles.textContainer}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.bio} numberOfLines={1}>
          {friend.bio ?? 'No bio yet'}
        </Text>
      </View>

      <Text style={[styles.indicator, selected && styles.indicatorSelected]}>
        {selected ? '✓' : '›'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 8,
  },
  containerSelected: {
    borderColor: '#000000',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  bio: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  indicator: {
    fontSize: 18,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  indicatorSelected: {
    color: '#000000',
  },
});
