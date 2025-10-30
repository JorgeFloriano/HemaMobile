// app/(tabs)/_layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import TopNavigationBar from "@/src/components/TopNavigationBar";
import BottomTabBar from "@/src/components/BottomTabBar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Top Navigation Bar */}
        <TopNavigationBar />

        {/* Main Content */}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="orders/index" />
            <Stack.Screen name="example/index" />
            <Stack.Screen name="users/index" />
          </Stack>
        </View>

        {/* Bottom Tab Bar - Will be positioned above device buttons */}
       
          <BottomTabBar />
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
});
