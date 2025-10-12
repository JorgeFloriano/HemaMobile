import { EyeOffIcon, EyeIcon } from "@/assets/images/icons/eye";
import React, { useState } from "react";
import {
  TextInput,
  TextStyle,
  ViewStyle,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  type?: "text" | "email" | "password" | "date" | "time" | "number";
  // Add these new props for login functionality
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean; // New prop to enable show/hide toggle
  editable?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad";
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
  type = "text",
  // New props with defaults
  autoCapitalize = "sentences",
  autoCorrect = true,
  editable = true,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  secureTextEntry = false,
  showPasswordToggle = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Get keyboard type based on input type
  const getKeyboardType = () => {
    if (keyboardType) return keyboardType;

    switch (type) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      case "date":
      case "time":
        return "numbers-and-punctuation";
      default:
        return "default";
    }
  };

  // Get secure text entry based on type
  const getSecureTextEntry = () => {
    if (secureTextEntry && !isPasswordVisible) {
      return true;
    }
    return false;
  };

  // Format date input (DD/MM/YYYY)
  const formatDate = (text: string) => {
    const numbers = text.replace(/[^\d/]/g, "");

    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2).replace("/", "")}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    }
  };

  // Format time input (HH:MM)
  const formatTime = (text: string) => {
    const numbers = text.replace(/[^\d:]/g, "");

    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2).replace(":", "")}`;
    } else {
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
    }
  };

  const handleChangeText = (text: string) => {
    let formattedText = text;

    if (type === "date") {
      formattedText = formatDate(text);
    } else if (type === "time") {
      formattedText = formatTime(text);
    }

    onChangeText(formattedText);
  };

  // Get placeholder based on type
  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    switch (type) {
      case "date":
        return "DD/MM/AAAA";
      case "time":
        return "HH:MM";
      default:
        return "";
    }
  };

  // Get max length based on type
  const getMaxLength = () => {
    if (maxLength) return maxLength;

    switch (type) {
      case "date":
        return 10;
      case "time":
        return 5;
      default:
        return undefined;
    }
  };

  const inputStyle: TextStyle = {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: isFocused ? "#270984ff" : "#ced4da",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    ...(isFocused && {
      shadowColor: "#98c5fbff",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
    ...(multiline && {
      minHeight: 100,
      textAlignVertical: "top",
    }),
    ...((type === "date" || type === "time") && {
      color: value ? "#333" : "#6b7280",
    }),
    ...style,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={getPlaceholder()}
          maxLength={getMaxLength()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            showPasswordToggle && styles.inputWithToggle,
            inputStyle,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={getKeyboardType()}
          secureTextEntry={getSecureTextEntry()}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />

        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <View>
              {isPasswordVisible ? (
                <EyeOffIcon width={20} height={20} color="#666" />
              ) : (
                <EyeIcon width={20} height={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputWithToggle: {
    paddingRight: 50, // Space for the toggle button
  },
  toggleButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
    borderRadius: 4,
  },
  
  toggleText: {
    fontSize: 18,
  },
});

export default Input;
