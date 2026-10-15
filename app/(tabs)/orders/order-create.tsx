import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, StyleSheet, Text, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import TextInput from "@/src/components/TextInput";
import Button from "@/src/components/Button";
import OptionSelector from "@/src/components/OptionSelector";
import KeyboardAvoindingContainer from "@/src/components/KeyboardAvoidingContainer";
import CheckboxInput from "@/src/components/CheckboxInput";

interface Type {
  id: string;
  description: string;
}

interface Client {
  id: string;
  name: string;
}

interface FormData {
  order_type_id: string;
  client_id: string;
  sector: string;
  req_name: string;
  req_descr: string;
  equipment: string;
  is_emergency: boolean;
}

const CreateOrderScreen = () => {
  const router = useRouter();
  const [types, setTypes] = useState<Type[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    order_type_id: "",
    client_id: "",
    sector: "",
    req_name: "",
    req_descr: "",
    equipment: "",
    is_emergency: false,
  });

  // FIXED: Added useCallback to prevent infinite re-renders
  const loadData = useCallback(async () => {
    try {
      console.log("🔄 Loading order types...");

      const response = await api.get("/orders/create");

      // Check if response has error
      if (response.data.error) {
        Alert.alert("Acesso Negado", response.data.error);
        router.back();
        return;
      }

      // FIXED: Better data handling
      const typesData = response.data.types || response.data;

      const clientsData = response.data.clients || response.data;

      if (Array.isArray(typesData)) {
        setTypes(typesData);
        console.log(`✅ Loaded ${typesData.length} order types`);
      } else {
        console.warn("⚠️ Unexpected response format:", response.data);
        setTypes([]);
      }

      if (Array.isArray(clientsData)) {
        setClients(clientsData);
        console.log(`✅ Loaded ${clientsData.length} clients`);
      } else {
        console.warn("⚠️ Unexpected response format:", response.data);
        setClients([]);
      }

    } catch (error: any) {
      // Se a API retornou 403, o erro cai aqui
      if (error.response) {
        // O servidor respondeu com um status de erro (4xx, 5xx)
        const errorMessage = error.response.data.error || "Acesso Negado";

        Alert.alert("Acesso Negado", errorMessage);
        router.back();
      } else {
        // Erro de rede ou outro problema
        Alert.alert("Erro", "Falha ao carregar dados do serviço");
        console.error("Error loading order:", error);
      }
    }
  }, [router]);

  // FIXED: Added proper useEffect dependency array
  useEffect(() => {
    loadData();
  }, [loadData]); // Now loadData is stable due to useCallback

  const handleSubmit = async () => {
    if (!formData.order_type_id) {
      Alert.alert("Erro", "Por favor selecione um tipo de serviço");
      return;
    }

    if (!formData.client_id) {
      Alert.alert("Erro", "Por favor selecione uma unidade");
      return;
    }

    if (!formData.req_descr) {
      Alert.alert("Erro", "Por favor descreva o serviço solicitado");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      // Laravel API endpoint, automatcally identifies the store function trough method as POST
      const response = await api.post("/orders", formData);

      if (response.data.success) {
        Alert.alert("Sucesso", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              router.push("/"); // Go back to previous screen
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          response.data.message || "Falha ao criar ordem de serviço",
        );
      }
    } catch (error: any) {
      console.error("Error creating order:", error);

      // Handle validation errors from Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        Alert.alert("Erro", firstError[0]);
      } else {
        Alert.alert(
          "Erro",
          error.response?.data?.message || "Falha ao criar ordem de serviço",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      order_type_id: "",
      client_id: "",
      sector: "",
      req_name: "",
      req_descr: "",
      equipment: "",
      is_emergency: false,
    });
  };

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: Type) => {
    updateFormData("order_type_id", type.id);
  };

  const handleClientSelect = (client: Client) => {
    updateFormData("client_id", client.id);
  };

  return (
    <KeyboardAvoindingContainer>
      <View style={styles.form}>
        <Text style={styles.welcome}>Abrir Solicitação</Text>
        
        <OptionSelector
          label="Tipo de Serviço *"
          placeholder="Selecione um tipo de serviço"
          types={types}
          selectedTypeId={formData.order_type_id}
          onTypeSelect={handleTypeSelect}
          // labelKey="description" (já é o padrão)
        />

        <OptionSelector
          label="Unidade *"
          placeholder="Selecione uma unidade"
          types={clients}
          selectedTypeId={formData.client_id}
          onTypeSelect={handleClientSelect}
          labelKey="name" // <--- AQUI ESTÁ O TRUQUE: diz ao componente para usar 'name'
        />

        <TextInput
          label="Setor *"
          value={formData.sector}
          onChangeText={(text) => updateFormData("sector", text)}
          placeholder="Setor do atendimento"
          maxLength={30}
          type="text"
        />

        <TextInput
          label="Descrição *"
          value={formData.req_descr}
          onChangeText={(text) => updateFormData("req_descr", text)}
          placeholder="Descreva a atividade a ser realizada"
          multiline
          numberOfLines={10}
          maxLength={470}
          type="text"
        />

        <TextInput
          label="Equipamento"
          value={formData.equipment}
          onChangeText={(text) => updateFormData("equipment", text)}
          placeholder="Informações do equipamento"
          maxLength={70}
          type="text"
        />

        <CheckboxInput
          icon="alert-circle-outline"
          iconColor="red" // Opcional
          label="EMERGENCIAL (fora do horário comercial) "
          value={formData.is_emergency}
          onChange={(value) => updateFormData("is_emergency", value)}
        />

        <View style={styles.buttonGroup}>
          <Button
            title={loading ? "Criando..." : "Confirmar"}
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
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 16,
    color: "#333",
  },

  form: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
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
