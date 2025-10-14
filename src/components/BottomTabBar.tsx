// src/components/BottomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Tab {
  name: string;
  href: string;
  icon: string;
  label: string;
}

const tabs: Tab[] = [
  {
    name: 'index',
    href: '/(tabs)',
    icon: 'home',
    label: 'Início',
  },
  {
    name: 'orders',
    href: '/(tabs)/orders',
    icon: 'list',
    label: 'Pedidos',
  },
  {
    name: 'create',
    href: '/(tabs)/orders/create',
    icon: 'add-circle',
    label: 'Criar',
  },
  {
    name: 'profile',
    href: '/(tabs)/profile',
    icon: 'person',
    label: 'Perfil',
  },
];

const BottomTabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets(); // Get safe area insets

  const isActive = (href: string) => {
    if (href === '/(tabs)' && pathname === '/(tabs)') return true;
    return pathname.startsWith(href) && href !== '/(tabs)';
  };

  const TabButton = ({ tab }: { tab: Tab }) => {
    const active = isActive(tab.href);
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { 
            scale: withSpring(active ? 1.1 : 1, {
              damping: 15,
              stiffness: 150,
            })
          }
        ],
      };
    });

    const textStyle = useAnimatedStyle(() => {
      return {
        color: withTiming(active ? '#1b0363ff' : '#9ca3af', {
          duration: 200,
        }),
        fontSize: withTiming(active ? 12 : 11, {
          duration: 200,
        }),
        fontWeight: active ? '600' : '400',
      };
    });

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push(tab.href as any)}
        activeOpacity={0.7}
      >
        <Animated.View style={animatedStyle}>
          <Ionicons 
            name={tab.icon as any} 
            size={24} 
            color={active ? '#1b0363ff' : '#9ca3af'}
          />
        </Animated.View>
        <Animated.Text style={[styles.tabLabel, textStyle]}>
          {tab.label}
        </Animated.Text>
        
        {/* Active indicator */}
        {active && (
          <Animated.View 
            style={[
              styles.activeIndicator,
              animatedStyle
            ]} 
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TabButton key={tab.name} tab={tab} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    // Remove paddingBottom - let the device handle the safe area
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 3,
    backgroundColor: '#1b0363ff',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});

export default BottomTabBar;