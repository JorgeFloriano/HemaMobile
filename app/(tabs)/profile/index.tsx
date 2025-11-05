import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, StyleSheet, Text, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import KeyboardAvoidingContainer from "@/src/components/KeyboardAvoidingContainer";
import { useAuth } from "@/src/contexts/AuthContext";

// Add User type definition
interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  username: string;
  function?: string;
}

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user: authUser } = useAuth(); // ✅ Renamed to avoid conflict
  const [userData, setUserData] = useState<User | null>(null); // ✅ Renamed state

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    function: "",
  });

  // Load current user data
  // Load current user data
  const loadUser = useCallback(async () => {
    try {
      const response = await api.get(`/users/${authUser?.id}/edit`);
      const userData = response.data.user || response.data.data;
      setUserData(userData);

      setFormData({
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        username: userData.username || "",
        password: "",
        password_confirmation: "",
        function: userData.function || "",
      });
    } catch (error: any) {
      Alert.alert("Erro", "Falha ao carregar dados do usuário");
      console.error("Error loading user data:", error);
    }
  }, [authUser?.id]);
  // Load user data when component mounts
  useEffect(() => {
    if (authUser?.id) {
      loadUser();
    }
  }, [authUser?.id, loadUser]);

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

      // Update current user's profile - use authUser
      const response = await api.put(`/users/${authUser?.id}`, submitData);

      if (response.data.success) {
        Alert.alert("Sucesso", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              router.push("/(tabs)"); // Go back to users list
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          response.data.message || "Falha ao atualizar perfil"
        );
      }
    } catch (error: any) {
      console.error("Error updating user:", error);

      // Handle validation errors from Laravel
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        Alert.alert("Erro", firstError[0]);
      } else {
        Alert.alert(
          "Erro",
          error.response?.data?.message || "Falha ao atualizar perfil"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (userData) {
      // ✅ Use userData instead of user
      setFormData({
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        username: userData.username || "",
        password: "",
        password_confirmation: "",
        function: userData.function || "",
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check both authUser and userData
  if (!authUser || !userData) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingContainer>
      <View style={styles.form}>
        <Text style={styles.welcome}>Editar Perfil</Text>
        <Input
          label="Nome *"
          value={formData.name}
          onChangeText={(text) => updateFormData("name", text)}
          placeholder="Seu nome"
          maxLength={20}
          type="text"
        />
        <Input
          label="Sobrenome"
          value={formData.surname}
          onChangeText={(text) => updateFormData("surname", text)}
          placeholder="Seu sobrenome"
          maxLength={20}
          type="text"
        />
        <Input
          label="Email *"
          value={formData.email}
          onChangeText={(text) => updateFormData("email", text)}
          placeholder="Seu email"
          maxLength={50}
          type="email"
        />
        <Input
          label="Usuário *"
          value={formData.username}
          onChangeText={(text) => updateFormData("username", text)}
          placeholder="Seu nome de usuário"
          maxLength={20}
          type="text"
        />
        <Input
          label="Função"
          value={formData.function}
          onChangeText={(text) => updateFormData("function", text)}
          placeholder="Sua função"
          maxLength={20}
          type="text"
        />
        <Input
          label="Nova Senha (deixe vazio para manter a atual)"
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
        <View style={styles.buttonGroup}>
          <Button
            title={loading ? "Atualizando..." : "Atualizar"}
            onPress={handleSubmit}
            variant="primary"
            disabled={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingContainer>
  );
};

// ... your styles remain the same
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
  form: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
});

export default ProfileScreen;
