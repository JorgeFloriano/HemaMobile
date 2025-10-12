import React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center" as const,
    ...(variant === "primary" && {
      backgroundColor: "#1b0363ff",
    }),
    ...(variant === "secondary" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#1b0363ff",
    }),
    ...style,
  };

  const buttonTextStyle = {
    fontSize: 16,
    ...(variant === "primary" && {
      color: "white",
    }),
    ...(variant === "secondary" && {
      color: "#170258ff",
    }),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
