import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";

const CreateOrderScreen = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    function: "",
  });

  const validateForm = () => {
    if (!formData.name)
      return "Por favor insira o nome do usuário";
    if (!formData.email)
      return "Por favor insira um e-mail válido para o usuário";
    if (!formData.username)
      return "Por favor insira um nome de usuário";
    if (!formData.password)
      return "Por favor insira uma senha para o usuário";
    if (!formData.password_confirmation)
      return "Por favor confirme a senha para o usuário";
    if (formData.password !== formData.password_confirmation)
      return "A senha e a confirmação da senha devem ser iguais";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Erro", error);
      return;
    }

    setLoading(true);

    try {
      // Laravel API endpoint, automatcally identifies the store function trough method as POST
      const response = await api.post("/users", formData);

      if (response.data.success) {
        Alert.alert("Sucesso", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              router.push("/(tabs)/users"); // Go back to previous screen
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          response.data.message || "Falha ao criar cadastro de usuário"
        );
      }
    } catch (error: any) {
      console.error("Error creating user:", error);

      // Handle validation errors from Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        Alert.alert("Erro", firstError[0]);
      } else {
        Alert.alert(
          "Erro",
          error.response?.data?.message || "Falha ao criar cadastro de usuário"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
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
              value={formData.password_confirmation}
              onChangeText={(text) =>
                updateFormData("password_confirmation", text)
              }
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
