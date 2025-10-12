import React, { useState, useEffect } from "react";
import { 
  View, 
  ScrollView, 
  Alert, 
  StyleSheet, 
  Platform, 
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard 
} from "react-native";
import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import ServiceTypeSelector from "../components/ServiceTypeSelector";
import NavigationBar from "../components/NavigationBar";

interface Type {
  id: string;
  description: string;
}

const CreateOrderScreen = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    order_type_id: "",
    sector: "",
    req_name: "",
    req_date: new Date().toLocaleDateString('pt-BR'),
    req_time: new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    req_descr: "",
    equipment: "",
  });

  useEffect(() => {
    loadOrderTypes();
  }, []);

  const loadOrderTypes = async () => {
    try {
      const response = await api.get("/orders/create");
      setTypes(response.data.types);
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

    setLoading(true);
    try {
      await api.post("/orders", formData);
      Alert.alert("Success", "Order created successfully!");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to create order");
      console.error("Error creating order:", error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      order_type_id: "",
      sector: "",
      req_name: "",
      req_date: new Date().toLocaleDateString('pt-BR'),
      req_time: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
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
      {/* Fixed Navigation Bar */}
      <NavigationBar
        // logoSource={require('../assets/logo.png')}
        backgroundColor="#1b0363ff"
        tintColor="white"
      />
      
      {/* Keyboard avoiding view to handle keyboard covering inputs */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled" // Allow taps on inputs when keyboard is open
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              <ServiceTypeSelector
                types={types}
                selectedTypeId={formData.order_type_id}
                onTypeSelect={handleTypeSelect}
              />

              <Input
                label="Setor *"
                value={formData.sector}
                onChangeText={(text) => updateFormData("sector", text)}
                placeholder="Setor"
                maxLength={30}
                type="text"
              />

              <Input
                label="Nome do Solicitante *"
                value={formData.req_name}
                onChangeText={(text) => updateFormData("req_name", text)}
                placeholder="Solicitante"
                maxLength={20}
                type="text"
              />

              <View style={styles.row}>
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
              </View>

              <Input
                label="Problema Relatado *"
                value={formData.req_descr}
                onChangeText={(text) => updateFormData("req_descr", text)}
                placeholder="Descreva o problema"
                multiline
                numberOfLines={4}
                maxLength={470}
                type="text"
              />

              <Input
                label="Equipamento"
                value={formData.equipment}
                onChangeText={(text) => updateFormData("equipment", text)}
                placeholder="Equipamento"
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
                
                <Button
                  title="Voltar"
                  onPress={() => console.log('Navigate back')}
                  variant="secondary"
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 44 + 60 : (StatusBar.currentHeight || 0) + 60, // Navbar height
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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