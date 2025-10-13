import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const [animation] = React.useState(new Animated.Value(0));

  // Calculate the width for each tab (100% / number of tabs)
  const tabWidth = 100 / state.routes.length;

  // Update animation when active tab changes
  React.useEffect(() => {
    const toValue = state.index * tabWidth;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  }, /*[state.index]*/);

  return (
    <View style={styles.tabBarContainer}>
      {/* Animated Blue Border */}
      <Animated.View 
        style={[
          styles.activeIndicator,
          {
            width: `${tabWidth}%`,
            left: animation.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
      
      {/* Tab Buttons */}
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get the icon name based on route name
          const getIconName = () => {
            switch (route.name) {
              case 'explore':
                return 'paperplane.fill';
              case 'copy':
                return 'gear';
              default:
                return 'questionmark';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              //testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <IconSymbol
                size={28}
                name={getIconName()}
                color={isFocused ? '#270984' : '#A0A0A0'}
              />
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? '#270984' : '#A0A0A0' }
              ]}>
                {options.title || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: 'white',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#270984', // Your blue color
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});

export default CustomTabBar;