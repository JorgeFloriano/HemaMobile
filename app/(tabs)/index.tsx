import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Sistema HEMA</Text>
      <Text style={styles.subtitle}>
        Gerenciamento de Solicitações de Serviço (SAT)
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/(tabs)/orders/create")}
      >
        <Text style={styles.cardTitle}>Nova Solicitação</Text>
        <Text style={styles.cardDescription}>
          Solicitar um novo atendimento
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/(tabs)/orders")}
      >
        <Text style={styles.cardTitle}>Ver Solicitações</Text>
        <Text style={styles.cardDescription}>
          Consultar atendimentos solicitados anteriormente
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b0363ff",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
});
