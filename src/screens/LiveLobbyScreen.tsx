/**
 * LiveLobbyScreen
 *
 * Entry point for the invite flow. Shows the user's active lobby —
 * its status, capacity, and current members — and prompts them
 * to invite more players.
 *
 * Data is fetched from the lobby service on mount. Navigation to
 * InviteFriendsScreen passes the lobby ID so that screen can
 * send invites to the correct lobby.
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { LobbyCard } from '../components/LobbyCard';
import { LobbyDetailsCard } from '../components/LobbyDetailsCard';
import { getLobby } from '../services/lobbyService';
import { Lobby } from '../types/lobby';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveLobby'>;

export function LiveLobbyScreen({ route, navigation }: Props) {
  const { lobbyId } = route.params;

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLobby(lobbyId)
      .then(setLobby)
      .catch(() => setError('Could not load the lobby. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [lobbyId]);

  // Merge newly invited members into the lobby list when returning from InviteFriendsScreen.
  useEffect(() => {
    const newMembers = route.params.newMembers;
    if (!newMembers || newMembers.length === 0) return;

    setLobby((prev) => {
      if (!prev) return prev;
      const existingIds = new Set(prev.members.map((m) => m.id));
      const unique = newMembers.filter((m) => !existingIds.has(m.id));
      return { ...prev, members: [...prev.members, ...unique] };
    });
  }, [route.params.newMembers]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {isLoading && <ActivityIndicator style={styles.loader} />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {lobby && (
          <>
            <LobbyDetailsCard lobby={lobby} onPress={() => {}} />
            <Text style={styles.subtitle}>Waiting for people to join</Text>
            <LobbyCard lobby={lobby} />
          </>
        )}
      </View>

      {/* Invite CTA — always visible so user can act even while loading */}
      <View style={styles.footer}>
        <Button
          label="Invite more players"
          onPress={() => navigation.navigate('InviteFriends', { lobbyId })}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888888',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
  },
});
