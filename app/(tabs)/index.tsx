import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import NavigationBar from '@/src/components/NavigationBar';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}><NavigationBar
        // logoSource={require('../assets/logo.png')}
        backgroundColor="#1b0363ff"
        tintColor="white"
      />
      <Text style={styles.welcome}>Bem-vindo, {user?.name}!</Text>
      <Text style={styles.subtitle}>Sistema de Gerenciamento</Text>
      
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/(tabs)/orders/Create')}
      >
        <Text style={styles.cardTitle}>Criar Novo Pedido</Text>
        <Text style={styles.cardDescription}>Iniciar um novo pedido de serviço</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/(tabs)/orders/Create')}
      >
        <Text style={styles.cardTitle}>Ver Pedidos</Text>
        <Text style={styles.cardDescription}>Consultar pedidos existentes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b0363ff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});