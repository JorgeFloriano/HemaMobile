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
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import OptionSelector from "@/src/components/OptionSelector";

interface Type {
  id: string;
  description: string;
}

const CreateOrderScreen = () => {
  const router = useRouter();
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    order_type_id: "",
    sector: "",
    req_name: "",
    // req_date: new Date().toLocaleDateString("pt-BR"),
    // req_time: new Date().toLocaleTimeString("pt-BR", {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: false,
    // }),
    req_descr: "",
    equipment: "",
  });

  useEffect(() => {
    loadOrderTypes();
  }, []);

  const loadOrderTypes = async () => {
    try {
      const response = await api.get("/orders/create");
      setTypes(response.data.types || response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load order types");
      console.error("Error loading types:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.order_type_id) {
      Alert.alert("Error", "Please select a service type");
      return;
    }

    if (!formData.req_descr) {
      Alert.alert("Erro", "Por favor descreva o serviço solicitado");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await api.post("/orders", formData);

      if (response.data.success) {
        Alert.alert("Sucesso", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              router.back(); // Go back to previous screen
            },
          },
        ]);
      } else {
        Alert.alert(
          "Erro",
          response.data.message || "Falha ao criar ordem de serviço"
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
          error.response?.data?.message || "Falha ao criar ordem de serviço"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      order_type_id: "",
      sector: "",
      req_name: "",
      // req_date: new Date().toLocaleDateString("pt-BR"),
      // req_time: new Date().toLocaleTimeString("pt-BR", {
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   hour12: false,
      // }),
      req_descr: "",
      equipment: "",
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: Type) => {
    updateFormData("order_type_id", type.id);
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
            <Text style={styles.welcome}>Solicitação de Atendimento</Text>
            <OptionSelector
              label="Tipo de Serviço *"
              placeholder="Selecione um tipo de serviço"
              types={types}
              selectedTypeId={formData.order_type_id}
              onTypeSelect={handleTypeSelect}
            />

            <Input
              label="Setor *"
              value={formData.sector}
              onChangeText={(text) => updateFormData("sector", text)}
              placeholder="Setor do atendimento"
              maxLength={30}
              type="text"
            />

            {/* <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Data do Acionamento *"
                  value={formData.req_date}
                  onChangeText={(text) => updateFormData("req_date", text)}
                  placeholder="DD/MM/AAAA"
                  type="date"
                />
              </View>

              <View style={styles.halfInput}>
                <Input
                  label="Hora do Acionamento *"
                  value={formData.req_time}
                  onChangeText={(text) => updateFormData("req_time", text)}
                  placeholder="HH:MM"
                  type="time"
                />
              </View>
            </View> */}

            <Input
              label="Descrição *"
              value={formData.req_descr}
              onChangeText={(text) => updateFormData("req_descr", text)}
              placeholder="Descreva a atividade a ser realizada"
              multiline
              numberOfLines={10}
              maxLength={470}
              type="text"
            />

            <Input
              label="Equipamento"
              value={formData.equipment}
              onChangeText={(text) => updateFormData("equipment", text)}
              placeholder="Informações do equipamento"
              maxLength={70}
              type="text"
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
