import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  Pressable,
  Text,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "@/src/services/api";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";

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
  });

  const loadUser = useCallback(async () => {
    try {
      const response = await api.get(`/users/${id}/edit`);
      const userData = response.data.user || response.data.data;
      setUser(userData);

      setFormData({
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        username: userData.username || "",
        password: "",
        password_confirmation: "",
        function: userData.function || "",
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados do usuário");
      console.error("Error loading user:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id, loadUser]);

  const validateForm = () => {
    if (!formData.name) return "Por favor insira o nome do usuário";
    if (!formData.email) return "Por favor insira um e-mail válido para o usuário";
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
    });
  };

  const updateFormData = (field: string, value: string) => {
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
    <View style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} style={styles.pressableContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.welcome}>Editar Usuário</Text>

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
              label="Nova Senha (vazio para manter atual)"
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
              placeholder="Nova senha"
              maxLength={20}
              type="password"
            />

            <Input
              label="Confirmar Nova Senha"
              value={formData.password_confirmation}
              onChangeText={(text) =>
                updateFormData("password_confirmation", text)
              }
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
        </ScrollView>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "white",
  },
  pressableContainer: {
    flex: 1,
  },
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0,
  },
  form: {
    padding: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 16,
  },
});

export default UserEditScreen;
