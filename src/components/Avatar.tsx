/**
 * Avatar component.
 *
 * Displays a circular user avatar. Falls back to the user's
 * initial on a grey background when no image URL is provided.
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  name: string;
  avatarUrl: string | null;
  size?: number;
};

export function Avatar({ name, avatarUrl, size = 40 }: Props) {
  const initial = name.charAt(0).toUpperCase();
  const containerStyle = { width: size, height: size, borderRadius: size / 2 };

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[styles.image, containerStyle]}
        accessibilityLabel={`${name}'s avatar`}
      />
    );
  }

  return (
    <View style={[styles.fallback, containerStyle]}>
      <Text style={styles.initial}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E5E5E5',
  },
  fallback: {
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
  },
});
