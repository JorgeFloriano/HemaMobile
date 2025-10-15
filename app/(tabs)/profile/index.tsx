import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || "Não informado"}</Text>

        <Text style={styles.label}>Usuário:</Text>
        <Text style={styles.value}>{user?.username}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
});
