/**
 * InviteFriendsScreen
 *
 * The core of the invite flow. Layout:
 *
 *   [Cancel]   Invite Friends   [Invite (X)]  ← navigation header
 *   Search bar
 *   Friends list (tap to toggle selection)
 *   ─────────────────────────────────────────
 *   Share invite link section (for off-platform invites)
 *
 * The "Invite (X)" header button is disabled until at least one friend
 * is selected. Confirming sends invites for all selected friends and
 * navigates back to LiveLobbyScreen, which merges the new members in.
 *
 * Friends are filtered client-side as the user types. In production
 * this could be replaced with a debounced API search.
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FriendRow } from '../components/FriendRow';
import { SearchBar } from '../components/SearchBar';
import { getFriends, inviteFriend } from '../services/friendsService';
import { Friend } from '../types/friend';
import { LobbyMember } from '../types/lobby';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'InviteFriends'>;

export function InviteFriendsScreen({ route, navigation }: Props) {
  const { lobbyId } = route.params;

  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  // Set of selected friend IDs — toggled on each row tap.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getFriends()
      .then(setFriends)
      .catch(() => setError('Could not load friends. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter the friends list to match the search query.
  const filteredFriends = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(query));
  }, [friends, searchQuery]);

  // Toggle a friend's selected state.
  function handleToggleFriend(friend: Friend) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(friend.id) ? next.delete(friend.id) : next.add(friend.id);
      return next;
    });
  }

  /**
   * Send in-app invites for all selected friends, then navigate back to
   * LiveLobbyScreen. Passing newMembers as params triggers the lobby to
   * merge them into its member list.
   *
   * navigating to LiveLobby (already in the stack) pops this screen with
   * a left-slide animation, giving the feel of returning to the lobby.
   */
  const handleConfirmInvites = useCallback(async () => {
    setIsInviting(true);
    const selectedFriends = friends.filter((f) => selectedIds.has(f.id));

    try {
      await Promise.all(
        selectedFriends.map((f) => inviteFriend(lobbyId, f.id))
      );
      // Friend and LobbyMember share the same shape — cast directly.
      const newMembers: LobbyMember[] = selectedFriends;
      // popTo uses the back (left-slide) animation and updates the target screen's params.
      navigation.popTo('LiveLobby', { lobbyId, newMembers });
    } catch {
      // Keep the screen open so the user can retry.
      setIsInviting(false);
    }
  }, [friends, selectedIds, lobbyId, navigation]);

  // Open the native iOS share sheet with a personalised invite link.
  async function handleShareInviteLink() {
    try {
      await Share.share({
        message:
          `Join my lobby on baba and let's play! 🏓\n\n` +
          `https://baba.gg/join/${lobbyId}`,
      });
    } catch {
      // User dismissed the share sheet — no action needed.
    }
  }

  // Update the header buttons whenever selection or loading state changes.
  useLayoutEffect(() => {
    const canInvite = selectedIds.size > 0 && !isInviting;

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.headerCancel}>Cancel</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={canInvite ? handleConfirmInvites : undefined}
          disabled={!canInvite}
          accessibilityRole="button"
          accessibilityLabel={`Invite ${selectedIds.size} friends`}
          accessibilityState={{ disabled: !canInvite }}
        >
          <Text style={[styles.headerInvite, !canInvite && styles.headerInviteDisabled]}>
            {`Invite (${selectedIds.size})`}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedIds.size, isInviting, handleConfirmInvites]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for friends"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Friends on platform ──────────────────────────────── */}
        {isLoading && <ActivityIndicator style={styles.loader} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!isLoading &&
          !error &&
          filteredFriends.map((friend) => (
            <FriendRow
              key={friend.id}
              friend={friend}
              selected={selectedIds.has(friend.id)}
              onToggle={handleToggleFriend}
            />
          ))}

        {!isLoading && !error && filteredFriends.length === 0 && (
          <Text style={styles.emptyText}>No friends match your search.</Text>
        )}

        {/* ── Off-platform invite section ──────────────────────── */}
        <View style={styles.shareSection}>
          {/* Centred hairline — 50% of screen width */}
          <View style={styles.shareDividerRow}>
            <View style={styles.shareDivider} />
          </View>

          <Text style={styles.shareTitle}>Can't find your friend?</Text>
          <Text style={styles.shareBody}>
            Invite them with your personal link. If they join baba, you'll both
            be connected as friends, and you get the street cred.
          </Text>
          <TouchableOpacity
            onPress={handleShareInviteLink}
            accessibilityRole="button"
            accessibilityLabel="Share your invite link"
          >
            <Text style={styles.shareButtonLabel}>Share invite link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // ── Header buttons ─────────────────────────────────────────
  headerCancel: {
    fontSize: 16,
    color: '#000000',
  },
  headerInvite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerInviteDisabled: {
    color: '#AAAAAA',
  },
  // ── Body ───────────────────────────────────────────────────
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 24,
  },
  errorText: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 14,
    marginTop: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 24,
  },
  // ── Share section ──────────────────────────────────────────
  shareSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  shareDividerRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  shareDivider: {
    width: '50%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E6E6E6',
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  shareBody: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
    marginBottom: 16,
  },
  shareButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
