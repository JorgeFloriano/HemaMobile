import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

export default function ExampleScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exemplo</Text>
      <Text style={styles.placeholder}>Tela de exemplo para teste da navBar</Text>
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