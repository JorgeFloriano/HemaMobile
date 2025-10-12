import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "@/src/components/CustormTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Tabs.Screen
        name="copy"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}