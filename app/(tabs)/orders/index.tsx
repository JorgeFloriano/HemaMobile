import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

export default function OrdersScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      <Text style={styles.placeholder}>Lista de pedidos aparecerá aqui</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  placeholder: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
});