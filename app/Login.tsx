import React, { useState } from "react";
import { useRouter } from "expo-router";
import { authService } from "@/src/services/auth";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  loading?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  loading = false,
}) => {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors: string[] = [];

    // Basic validation
    if (!username.trim()) {
      newErrors.push("O campo usuário é obrigatório");
    }
    if (!password.trim()) {
      newErrors.push("O campo senha é obrigatório");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    try {
      // Call your Laravel API
      const response = await authService.login({
        username: username.trim(),
        password: password.trim(),
      });

      // Use the context login function to update global state
      await login(response.token, response.user);

      // Call the success callback
      onLogin(username, password);

      // ✅ ADD THIS: Navigate to OrderCreate after successful login
      router.replace("/(tabs)"); // or whatever your route path is
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different error types
      if (error.response?.status === 401) {
        setErrors(["Credenciais inválidas"]);
      } else if (error.response?.status === 422) {
        // Validation errors from Laravel
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat() as string[];
        setErrors(errorMessages);
      } else if (error.message === "Network Error") {
        setErrors(["Erro de conexão. Verifique sua internet."]);
      } else {
        setErrors(["Erro no servidor. Tente novamente."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo_hema.png")} // Replace with your logo path
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Sistema de Gerenciamento</Text>

              <Input
                label="Usuário"
                value={username}
                onChangeText={setUsername}
                placeholder="Usuário"
                containerStyle={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
                containerStyle={styles.input}
                type="password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                showPasswordToggle={true}
              />

              <Button
                title={isLoading ? "ENTRANDO..." : "ENTRAR"}
                onPress={handleLogin}
                variant="primary"
                disabled={isLoading}
                style={styles.loginButton}
              />

              {/* Error Messages */}
              {errors.length > 0 && (
                <View style={styles.errorContainer}>
                  {errors.map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                      • {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  logoContainer: {
    padding: 30,
    backgroundColor: "#1b0363ff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  logo: {
    width: "100%",
    height: 80,
  },
  formContainer: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#f5c6cb",
  },
  errorText: {
    color: "#721c24",
    fontSize: 14,
    marginBottom: 4,
  },
});

export default LoginScreen;
