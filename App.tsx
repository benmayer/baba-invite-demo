/**
 * App entry point.
 *
 * Sets up the navigation container and root stack navigator.
 * The app always opens on the LiveLobby screen with a hardcoded
 * demo lobby ID
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { InviteFriendsScreen } from './src/screens/InviteFriendsScreen';
import { LiveLobbyScreen } from './src/screens/LiveLobbyScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Demo lobby ID — represents a lobby the current user just created.
const DEMO_LOBBY_ID = 'lobby-001';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: '',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <Stack.Screen
          name="LiveLobby"
          component={LiveLobbyScreen}
          initialParams={{ lobbyId: DEMO_LOBBY_ID }}
          options={{ title: 'Live Lobby', headerRight: () => null }}
        />
        <Stack.Screen
          name="InviteFriends"
          component={InviteFriendsScreen}
          options={{
            title: 'Invite Friends',
            // Cancel replaces the default back button.
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
