import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome";

type CheckboxInputProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap; // Nome do ícone
  iconColor?: string; // Cor personalizada para o ícone
};

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  value,
  onChange,
  icon,
  iconColor = "#1b0363", // Cor padrão caso não envie uma
}) => {
  const handleCheckboxChange = () => {
    onChange(!value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleCheckboxChange}
        style={styles.TouchableOpacity}
        activeOpacity={0.8}
      >
        <View
          style={
            value ? styles.selectedCheckboxContainer : styles.checkboxContainer
          }
        >
          {value ? (
            <Text style={styles.checkedText}>
              <FontAwesome6 name="check" size={15} color="#1b0363" />
            </Text>
          ) : null}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.label}>{label}</Text>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={iconColor}
              style={styles.iconStyle}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconStyle: {
    marginRight: 4,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCheckboxContainer: {
    width: 24,
    height: 24,
    borderColor: "#1b0363",
    // Mantido conforme seu original
    outlineColor: "#1b03633e",
    outlineWidth: 3,
    outlineStyle: "solid",
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  TouchableOpacity: {
    flexDirection: "row",
    alignItems: "center", // Garante alinhamento vertical entre box e texto
  },
  checkedText: {
    color: "#333",
    fontWeight: "600",
  },
});

export default CheckboxInput;
