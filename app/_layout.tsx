// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, StatusBar } from "react-native";
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';

function RootLayoutContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1b0363ff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? (
          // Show login when not authenticated (no navigation bars)
          <Stack.Screen name="Login" />
        ) : (
          // Show tabs when authenticated (with navigation bars)
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}