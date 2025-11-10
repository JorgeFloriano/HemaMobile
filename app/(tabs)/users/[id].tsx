import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, StyleSheet, Text, Keyboard } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "@/src/services/api";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import CheckboxInput from "@/src/components/CheckboxInput";
import KeyboardAvoindingContainer from "@/src/components/KeyboardAvoidingContainer";

const UserEditScreen = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    function: "",
    can_create_sat: false,
    can_see_sat: false,
  });

  const loadUser = useCallback(async () => {
    try {
      const response = await api.get(`/users/${id}/edit`);

      // Check if the API response indicates failure
      if (response.data.success === false) {
        throw new Error(
          response.data.error ||
            response.data.message ||
            "Falha ao carregar usuário"
        );
      }

      const userData = response.data.user || response.data.data;

      if (!userData) {
        throw new Error("Dados do usuário não encontrados na resposta");
      }

      setUser(userData);

      console.log(JSON.stringify(userData, null, 2));

      setFormData({
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        username: userData.username || "",
        password: "",
        password_confirmation: "",
        function: userData.function || "",
        // Access cli attributes safely
        can_create_sat: userData?.can_create_sat || false,
        can_see_sat: userData?.can_see_sat || false,
      });
    } catch (error: any) {
      console.error("Error loading user:", error);

      let errorMessage = "Falha ao carregar usuário";

      // Handle different error scenarios
      if (error.response?.status === 404) {
        // 404 errors from your API
        errorMessage = error.response?.data?.error || "Usuário não encontrado";
      } else if (error.response?.data?.error) {
        // Other API errors with error field
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        // API errors with message field
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Error thrown from our code
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id, loadUser]);

  const validateForm = () => {
    if (!formData.name) return "Por favor insira o nome do usuário";
    if (!formData.email)
      return "Por favor insira um e-mail válido para o usuário";
    if (!formData.username) return "Por favor insira um nome de usuário";
    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    )
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
    Keyboard.dismiss();

    try {
      // Remove password fields if empty (to keep current password)
      const submitData = { ...formData } as { password?: string };
      if (!submitData.password) {
        delete (submitData as any).password;
        delete (submitData as any).password_confirmation;
      }

      // Laravel API endpoint, automatically identifies the update function through method as PUT
      const response = await api.put(`/users/${id}`, submitData);

      if (response.data.success) {
        Alert.alert("Sucesso", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              router.push("/(tabs)/users"); // Go back to users list
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          response.data.message || "Falha ao atualizar usuário"
        );
      }
    } catch (error: any) {
      console.error("Error updating user:", error);

      // Handle validation errors from Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        Alert.alert("Erro", firstError[0]);
      } else {
        Alert.alert(
          "Erro",
          error.response?.data?.message || "Falha ao atualizar usuário"
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
      can_create_sat: false,
      can_see_sat: false,
    });
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoindingContainer>
      <View style={styles.form}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Editar Usuário</Text>
          <Button
            title={loading ? "Salvando..." : "Salvar"}
            onPress={handleSubmit}
            variant="primary"
            disabled={loading}
          />
        </View>

        <CheckboxInput
          label="Permitir criação de solicitação"
          value={formData.can_create_sat}
          onChange={(value) => updateFormData("can_create_sat", value)}
        />

        <CheckboxInput
          label="Permitir visualização de solicitação"
          value={formData.can_see_sat}
          onChange={(value) => updateFormData("can_see_sat", value)}
        />

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
          label="Nova Senha (deixe vazio para manter atual)"
          value={formData.password}
          onChangeText={(text) => updateFormData("password", text)}
          placeholder="Nova senha"
          maxLength={20}
          type="password"
        />

        <Input
          label="Confirmar Nova Senha"
          value={formData.password_confirmation}
          onChangeText={(text) => updateFormData("password_confirmation", text)}
          placeholder="Confirmar nova senha"
          maxLength={20}
          type="password"
        />

        <View style={styles.header}>
          <Button
            title={loading ? "Atualizando..." : "Atualizar"}
            onPress={handleSubmit}
            variant="primary"
            disabled={loading}
          />
        </View>
      </View>
    </KeyboardAvoindingContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  form: {
    paddingHorizontal: 20,
    backgroundColor: "#ffffffff",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  header: {
    marginTop: 4,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default UserEditScreen;
