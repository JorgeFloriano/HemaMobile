// src/components/TopNavigationBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface TopNavigationBarProps {
  title?: string;
  showLogout?: boolean;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ 
  title = "Sistema de Gerenciamento",
  showLogout = true 
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Background */}
      <View style={styles.statusBarBackground} />
      
      {/* Navigation Content */}
      <View style={styles.content}>
        {/* Logo on the left */}
        <Image
          source={require('@/assets/images/logo2_hema.png')}
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

        {/* Logout button on the right */}
        {showLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b0363ff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    backgroundColor: '#1b0363ff',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  logo: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
});

export default TopNavigationBar;