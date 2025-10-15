// src/components/BottomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate
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
    href: '/(tabs)/orders/create',
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
  const insets = useSafeAreaInsets();

  // Find active tab index for the animated border
  const activeIndex = tabs.findIndex(tab => {
    if (tab.href === '/(tabs)' && pathname === '/(tabs)') return true;
    return pathname.startsWith(tab.href) && tab.href !== '/(tabs)';
  });

  // Animation value for the blue border
  const borderAnimation = useSharedValue(activeIndex);

  // Update border position when active tab changes
  React.useEffect(() => {
    borderAnimation.value = withSpring(activeIndex, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex, borderAnimation]);

  const isActive = (href: string) => {
    if (href === '/(tabs)' && pathname === '/(tabs)') return true;
    return pathname.startsWith(href) && href !== '/(tabs)';
  };

  const TabButton = ({ tab, index }: { tab: Tab; index: number }) => {
    const active = isActive(tab.href);
    
    const iconAnimatedStyle = useAnimatedStyle(() => {
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

    const textAnimatedStyle = useAnimatedStyle(() => {
      return {
        color: withTiming(active ? '#270984' : '#A0A0A0', { // Your blue and gray colors
          duration: 200,
        }),
        fontSize: withTiming(active ? 12 : 11, {
          duration: 200,
        }),
        fontWeight: active ? '600' : '500',
      };
    });

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push(tab.href as any)}
        activeOpacity={0.7}
      >
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons 
            name={tab.icon as any} 
            size={28} // Increased size like your visual component
            color={active ? '#270984' : '#A0A0A0'} // Your exact colors
          />
        </Animated.View>
        <Animated.Text style={[styles.tabLabel, textAnimatedStyle]}>
          {tab.label}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  // Animated style for the blue border
  const borderAnimatedStyle = useAnimatedStyle(() => {
    const tabWidth = 100 / tabs.length;
    const left = interpolate(
      borderAnimation.value,
      [0, tabs.length - 1],
      [0, 100 - tabWidth]
    );

    return {
      left: `${left}%`,
      width: `${tabWidth}%`,
    };
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Animated Blue Border - Like your visual component */}
      <Animated.View style={[styles.activeIndicator, borderAnimatedStyle]} />
      
      {/* Tab Buttons */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TabButton key={tab.name} tab={tab} index={index} />
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
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#270984', // Your exact blue color
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});

export default BottomTabBar;