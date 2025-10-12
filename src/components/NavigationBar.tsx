import React, { useState } from "react";
import { Image } from "expo-image";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  StatusBar,
  Platform,
  Alert
} from "react-native";

interface NavigationBarProps {
  logoStyle?: any;
  menuOptions?: {
    label: string;
    onPress: () => void;
    icon?: string;
  }[];
  backgroundColor?: string;
  tintColor?: string;
}

const menuOptions = [
    {
      label: 'Início',
      onPress: () => console.log('Navigate to home'),
      icon: '🏠',
    },
    {
      label: 'Todas as Ordens',
      onPress: () => console.log('Navigate to all orders'),
      icon: '📋',
    },
    {
      label: 'Configurações',
      onPress: () => Alert.alert('Configurações', 'Abrir configurações'),
      icon: '⚙️',
    },
    {
      label: 'Ajuda',
      onPress: () => Alert.alert('Ajuda', 'Central de ajuda'),
      icon: '❓',
    },
  ];

const NavigationBar: React.FC<NavigationBarProps> = ({
  backgroundColor = "#1b0363ff",
  tintColor = "white",
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMenuOptionPress = (onPress: () => void) => {
    toggleMenu();
    onPress();
  };

  const defaultMenuOptions = [
    {
      label: "Perfil",
      onPress: () => console.log("Perfil pressed"),
      icon: "👤",
    },
    {
      label: "Configurações",
      onPress: () => console.log("Configurações pressed"),
      icon: "⚙️",
    },
    {
      label: "Sair",
      onPress: () => console.log("Sair pressed"),
      icon: "🚪",
    },
  ];

  const options = menuOptions.length > 0 ? menuOptions : defaultMenuOptions;

  // Calculate total height including status bar
  const statusBarHeight =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;
  const totalHeight = statusBarHeight + 60; // status bar + nav bar height

  return (
    <>
      {/* Fixed Navigation Bar */}
      <View
        style={[styles.container, { backgroundColor, height: totalHeight }]}
      >
        {/* Status Bar Area - Background extends here */}
        <View style={[styles.statusBarArea, { height: statusBarHeight }]} />

        {/* Navigation Bar Content */}
        <View style={styles.navContent}>
          {/* Left Side - Logo and Company Name */}
          <View style={styles.leftContainer}>
            <Image
              source={require("@/assets/images/logo2_hema.png")}
              style={{ width: 40, height: 35, alignSelf: "center" }}
            />
          </View>

          {/* Right Side - Menu Icon */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Text style={[styles.menuIcon, { color: tintColor }]}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Slide-in Menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menuContainer,
                  {
                    transform: [{ translateX: slideAnim }],
                    backgroundColor: backgroundColor,
                    height: "100%",
                  },
                ]}
              >
                {/* Menu Header - Positioned at the very top */}
                <View style={[styles.menuHeader, { height: totalHeight }]}>
                  <View
                    style={[styles.statusBarArea, { height: statusBarHeight }]}
                  />
                  <View style={styles.menuHeaderContent}>
                    <Image
                      source={require("@/assets/images/logo2_hema.png")}
                      style={{ width: 40, height: 35, alignSelf: "center" }}
                    />

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={toggleMenu}
                    >
                      <Text style={[styles.closeIcon, { color: tintColor }]}>
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Menu Options - Below the header */}
                <View style={[styles.menuOptions, { marginTop: totalHeight }]}>
                  {options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.menuOption}
                      onPress={() => handleMenuOptionPress(option.onPress)}
                    >
                      {option.icon && (
                        <Text style={styles.menuOptionIcon}>{option.icon}</Text>
                      )}
                      <Text
                        style={[styles.menuOptionText, { color: tintColor }]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    // Remove pointerEvents to allow scrolling through
  },
  statusBarArea: {
    width: "100%",
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 60,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 300,
  },
  menuHeader: {
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  menuHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  menuLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuCompanyName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    padding: 4,
    
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuOptions: {
    paddingVertical: 8,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuOptionIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  menuOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default NavigationBar;
