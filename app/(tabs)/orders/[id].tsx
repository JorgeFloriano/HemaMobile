import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "@/src/services/api";
import Button from "@/src/components/Button";
import { Order } from "@/app/(tabs)/orders";

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load order details
  const loadOrder = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api.get<{ order: Order }>(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        Alert.alert("Error", "Failed to load order details");
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id]
  ); // Add dependencies that loadOrder uses

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id, loadOrder]); // Now include loadOrder in dependencies

  // Handle refresh
  const handleRefresh = () => {
    loadOrder(true);
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Format date and time for Brazilian display
  const formatDateTime = (date: string, time: string) => {
    // If date is already in DD/MM/YYYY format from API, use it directly
    let formattedDate = date; // Assuming API returns DD/MM/YYYY

    // If date comes in YYYY-MM-DD format from API, convert to DD/MM/YYYY
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      formattedDate = formatDate(date);
    }

    // Format time to Brazilian format (HH:MM)
    const formattedTime = time.length === 5 ? time : time.substring(0, 5);

    return `${formattedDate} às ${formattedTime}`;
  };

  // Get status display
  const getStatusInfo = (finished: boolean) => {
    return {
      text: finished ? "Finalizada" : "Pendente",
      color: finished ? "#4CAF50" : "#FF9800",
      bgColor: finished ? "#E8F5E8" : "#FFF3E0",
    };
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ordem não encontrada</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          style={styles.backButton}
        />
      </View>
    );
  }

  console.log(["order", order]);

  const statusInfo = getStatusInfo(order.finished);

  const MaterialsList = ({
    materials,
  }: {
    materials?: {
      id: string;
      description: string;
      unit: string;
      pivot: { quantity: number; };
    }[];
  }) => {
    // Handle empty or undefined materials
    if (!materials || materials.length === 0) {
      return '';
    }

    return (
      <Text style={styles.description}>
        {materials.map((material, index) => (
          <Text key={material.id}>
            {material.description} ({material.pivot.quantity} {material.unit})
            {index === materials.length - 1 ? ". " : ", "}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.serviceNumber}>Solicitação Nº {order.id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusInfo.bgColor },
              ]}
            >
              <Text style={[styles.intervValue, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
          <Text style={styles.orderType}>Tipo: {order.type.description}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Solicitação</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Setor:</Text>
            <Text style={styles.detailValue}>{order.sector}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nome do Solicitante:</Text>
            <Text style={styles.detailValue}>{order.req_name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data e Hora:</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(order.req_date, order.req_time)}
            </Text>
          </View>

          {order.id && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Equipamento:</Text>
              <Text style={styles.detailValue}>{order.equipment}</Text>
            </View>
          )}
        </View>

        {/* Notes Section */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Atendimento</Text>
          {order.notes.map((note, index) => (
            <View key={index}>
              <View style={styles.intervRow}>
                <Text style={styles.intervLabel}>
                  Intervenção {index + 1} de {order.notes.length}
                </Text>
                <Text style={styles.intervValue}>{formatDate(note.date)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Serviços Realizados:</Text>
              </View>

              <Text style={styles.description}>{note.services}</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Materiais utilizados:</Text>
              </View>

              <MaterialsList materials={note.materials} />

              <View
                style={[
                  styles.details,
                  index === order.notes.length - 1 && styles.noBorder, // Remove border for last item
                ]}
              >
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Setor:</Text>
                  <Text style={styles.detailValue}>{order.sector}</Text>
                </View>

                {order.tec && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Técnico:</Text>
                    <Text style={styles.detailValue}>
                      {order.tec.user.name} {order.tec.user.surname}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Button
          title="Voltar"
          onPress={() => router.push("/(tabs)/orders")}
          variant="secondary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    minWidth: 120,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  serviceNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  intervValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  orderType: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
  },

  bottomNav: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    flexDirection: "row",
  },
  intervRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    paddingVertical: 4,
    color: "#333",
  },
  intervLabel: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1ceceff",
    paddingTop: 12,
    marginBottom: 12,
  },
  noBorder: {
    borderBottomWidth: 0, // Remove border
  },
});

export default OrderDetailScreen;
