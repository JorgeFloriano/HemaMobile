// src/components/TopNavigationBar.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TopNavigationBarProps {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
  onBackPress?: () => void;
}

// Utility function to remove last path segment
const getParentPath = (path: string): string => {
  // Remove the last segment after the last "/"
  const lastSlashIndex = path.lastIndexOf("/");
  if (lastSlashIndex > 0) {
    return path.substring(0, lastSlashIndex);
  }
  return path; // Return original if no slash found
};

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  title = "Sistema de Gerenciamento",
  showBack = true,
  showLogout = true,
  onBackPress,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      // Simple: go to parent path by removing last segment
      const parentPath = getParentPath(pathname);

      // Only navigate if we're not already at the root
      if (parentPath !== pathname) {
        router.push(parentPath as any);
      } else {
        // If we're at root, use default back
        router.push("/(tabs)");
      }
      if (pathname === "/") {
        handleLogout();
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Background */}
      <View style={styles.statusBarBackground} />

      {/* Navigation Content */}
      <View style={styles.content}>
        {/* Logo on the right for balance */}
        <Image
          source={require("@/assets/images/logo2_hema.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome message in center */}
        <View style={styles.titleContainer}>
          {user && (
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
          )}
        </View>
        {/* Back button on the left */}
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1b0363ff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  statusBarBackground: {
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
    backgroundColor: "#1b0363ff",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 12,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  userName: {
    color: "white",
    fontSize: 22,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
  },
});

export default TopNavigationBar;
