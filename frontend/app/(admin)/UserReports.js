import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../../src/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API = "https://parkeasy-5qpq.onrender.com/api/reports";

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await axios.get(API);
      setReports(res.data.reports || []);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, []);

  const handleResolve = async (id) => {
    Alert.alert(
      "Resolve Report",
      "Are you sure you want to mark this report as resolved?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resolve",
          onPress: async () => {
            try {
              await axios.put(`${API}/${id}`);
              setReports((prev) =>
                prev.map((item) =>
                  item._id === id ? { ...item, status: "Resolved" } : item,
                ),
              );
              Alert.alert("Success", "Report marked as resolved");
            } catch (error) {
              Alert.alert("Error", "Failed to resolve report");
            }
          },
        },
      ],
    );
  };

  const openReportDetails = (item) => {
    setSelectedReport(item);
    setModalVisible(true);
  };

  const getStatusStyle = (status) => {
    const isResolved = status === "Resolved";
    return {
      bg: isResolved ? "#dcfce7" : "#fee2e2",
      text: isResolved ? "#16a34a" : "#dc2626",
      icon: isResolved ? "checkmark-circle" : "time-outline",
      label: status || "Pending",
    };
  };

  const getIssueIcon = (issueType) => {
    switch (issueType?.toLowerCase()) {
      case "parking":
        return "car-outline";
      case "payment":
        return "card-outline";
      case "bug":
        return "bug-outline";
      default:
        return "alert-circle-outline";
    }
  };

  const renderItem = ({ item }) => {
    const status = getStatusStyle(item.status);
    const date = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "Just now";

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => openReportDetails(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIssueIcon(item.issueType)}
              size={24}
              color="#2563eb"
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.issueType}>{item.issueType}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={12} color={status.text} />
            <Text style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color="#64748b" />
          <Text style={styles.email}>{item.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
            <Text style={styles.dateText}>{date}</Text>
          </View>

          {item.status !== "Resolved" && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={(e) => {
                e.stopPropagation();
                handleResolve(item._id);
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.resolveText}>Resolve</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No Reports</Text>
      <Text style={styles.emptyText}>No user reports available</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>User Reports</Text>
          <Text style={styles.headerSub}>{reports.length} reports found</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="flag" size={28} color="#fff" />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={EmptyList}
        />
      )}

      {/* Modal for detailed view */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Report Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={28} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalIconWrapper}>
                    <Ionicons
                      name={getIssueIcon(selectedReport.issueType)}
                      size={50}
                      color="#2563eb"
                    />
                  </View>

                  <Text style={styles.modalIssueType}>
                    {selectedReport.issueType}
                  </Text>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="person-outline" size={18} color="#64748b" />
                    <Text style={styles.modalInfoText}>
                      {selectedReport.name}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="mail-outline" size={18} color="#64748b" />
                    <Text style={styles.modalInfoText}>
                      {selectedReport.email}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#64748b"
                    />
                    <Text style={styles.modalInfoText}>
                      {selectedReport.createdAt
                        ? new Date(selectedReport.createdAt).toLocaleString()
                        : "Just now"}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.modalMessageLabel}>Message</Text>
                  <Text style={styles.modalMessage}>
                    {selectedReport.message}
                  </Text>

                  <View style={styles.modalStatusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusStyle(selectedReport.status)
                            .bg,
                          alignSelf: "center",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                        },
                      ]}
                    >
                      <Ionicons
                        name={getStatusStyle(selectedReport.status).icon}
                        size={16}
                        color={getStatusStyle(selectedReport.status).text}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusStyle(selectedReport.status).text },
                        ]}
                      >
                        {getStatusStyle(selectedReport.status).label}
                      </Text>
                    </View>
                  </View>

                  {selectedReport.status !== "Resolved" && (
                    <TouchableOpacity
                      style={styles.modalResolveButton}
                      onPress={() => {
                        handleResolve(selectedReport._id);
                        setModalVisible(false);
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fff"
                      />
                      <Text style={styles.modalResolveText}>
                        Mark as Resolved
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#f8fafc",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  headerSub: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f2f5",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  issueType: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "600",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  email: {
    fontSize: 13,
    color: "#64748b",
    flex: 1,
  },
  message: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  resolveButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resolveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 28,
    width: "90%",
    maxHeight: "85%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  modalIconWrapper: {
    alignItems: "center",
    marginVertical: 12,
  },
  modalIssueType: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalInfoText: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
  modalMessageLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 20,
  },
  modalStatusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalResolveButton: {
    backgroundColor: "#16a34a",
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  modalResolveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
