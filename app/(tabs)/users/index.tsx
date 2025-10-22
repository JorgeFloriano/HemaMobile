import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import UserCard from "@/src/components/UserCard";
import Button from "@/src/components/Button";

// Types
export interface User {
  id: string;
  name: string;
  surname?: string;
  username: string;
  function?: string;
}

interface UsersResponse {
  users: User[];
}

// Mock data for testing
const mockUsers: User[] = [
  {
    id: "1",
    name: "João",
    surname: "Silva",
    username: "joao.silva",
    function: "Técnico de TI"
  },
  {
    id: "2", 
    name: "Maria",
    surname: "Santos",
    username: "maria.santos",
    function: "Supervisora"
  },
  {
    id: "3",
    name: "Pedro",
    surname: "Oliveira",
    username: "pedro.oliveira",
    function: "Analista"
  },
  {
    id: "4",
    name: "Ana",
    surname: "Costa",
    username: "ana.costa", 
    function: "Coordenadora"
  },
  {
    id: "5",
    name: "Carlos",
    surname: "Ferreira",
    username: "carlos.ferreira",
    function: "Gerente"
  },
  {
    id: "6",
    name: "Juliana",
    surname: "Ribeiro",
    username: "juliana.ribeiro",
    function: "Assistente"
  }
];

const UsersScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true); // Set to false when API is ready
  const router = useRouter();

  // Load users
  const loadUsers = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      
      if (useMockData) {
        // Use mock data for testing
        setTimeout(() => {
          setUsers(mockUsers);
        }, 1000); // Simulate API delay
      } else {
        // Use real API
        const response = await api.get<UsersResponse>("/users");
        setUsers(response.data.users);
      }
    } catch (err) {
      const errorMessage = "Failed to load users";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Rest of your component remains the same...
  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  // ... rest of your existing code

  // Pull to refresh
  const handleRefresh = () => {
    loadUsers(true);
  };

  // Navigate to create user
  const handleCreateUser = () => {
    router.push("/(tabs)/users/user-create");
  };

  // Render user item
  const renderUserItem = ({ item }: { item: User }) => (
    <UserCard user={item} />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No users found</Text>
      <Button
        title="Create First User"
        onPress={handleCreateUser}
        variant="primary"
        style={styles.emptyStateButton}
      />
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorStateText}>{error}</Text>
      <Button
        title="Try Again"
        onPress={() => loadUsers()}
        variant="primary"
        style={styles.errorStateButton}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  if (error && !loading) {
    return renderErrorState();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.welcome}>Usuários</Text>
          <Button
            onPress={handleCreateUser}
            title="Novo"
            variant="primary"
          />
        </View>
        <Text style={styles.subtitle}>
          Gerenciamento de Usuários
        </Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  header: {
    justifyContent: "space-between",
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "space-between",
   marginBottom: 10,
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
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyStateButton: {
    minWidth: 160,
  },
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorStateText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 20,
    textAlign: "center",
  },
  errorStateButton: {
    minWidth: 120,
  },
});

export default UsersScreen;
