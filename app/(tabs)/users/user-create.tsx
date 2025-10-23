import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import api from "@/src/services/api";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";

const CreateOrderScreen = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    function: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/users", formData);
      Alert.alert("Usuário cadastrado com sucesso!");
      resetForm();
    } catch (error) {
      Alert.alert("Erro ao cadastrar usuário");
      console.error("Error creating order:", error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      email: "",
      username: "",
      password: "",
      function: "",
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.welcome}>Cadastrar Usuário</Text>

            <Input
              label="Nome *"
              value={formData.name}
              onChangeText={(text) => updateFormData("name", text)}
              placeholder="Nome do Usuário"
              maxLength={20}
              type="text"
            />

            <Input
              label="Sobrenome"
              value={formData.surname}
              onChangeText={(text) => updateFormData("surname", text)}
              placeholder="Sobrenome do Usuário"
              maxLength={20}
              type="text"
            />

            <Input
              label="Email *"
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder="Email"
              maxLength={50}
              type="email"
            />

            <Input
              label="Usuário *"
              value={formData.username}
              onChangeText={(text) => updateFormData("username", text)}
              placeholder="Username"
              maxLength={20}
              type="text"
            />

            <Input
              label="Função"
              value={formData.function}
              onChangeText={(text) => updateFormData("function", text)}
              placeholder="Função"
              maxLength={20}
              type="text"
            />

            <Input
              label="Senha *"
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
              placeholder="Senha"
              maxLength={20}
              type="password"
            />

            <Input
              label="Confirmar Senha *"
              value={formData.password}
              onChangeText={(text) => updateFormData("password_confirm", text)}
              placeholder="Confirmar Senha"
              maxLength={20}
              type="password"
            />

            <View style={styles.buttonGroup}>
              <Button
                title={loading ? "Salvando..." : "Salvar"}
                onPress={handleSubmit}
                variant="primary"
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "white",
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

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0, // Navbar height
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 16,
  },
});

export default CreateOrderScreen;
