import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API = "https://parkeasy-5qpq.onrender.com/api/reports";

const ReportScreen = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("Parking");
  const [message, setMessage] = useState("");

  // Data state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // Fetch reports
  const fetchReports = async () => {
    setFetching(true);
    try {
      const res = await axios.get(API);
      setReports(res.data.reports || []);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setFetching(false);
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

  // Submit new report
  const handleSubmit = async () => {
    if (!name || !email || !message) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      setLoading(true);
      await axios.post(`${API}/create`, { name, email, issueType, message });
      Alert.alert("Success", "Report submitted successfully");
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setIssueType("Parking");
      fetchReports();
    } catch (error) {
      Alert.alert("Error", "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  // Delete report with confirmation
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API}/${id}`);
              setReports((prev) => prev.filter((item) => item._id !== id));
              Alert.alert("Deleted", "Report deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Delete failed");
            }
          },
        },
      ],
    );
  };

  // Open edit modal with report data
  const openEditModal = (item) => {
    setEditingReport(item);
    setName(item.name);
    setEmail(item.email);
    setIssueType(item.issueType);
    setMessage(item.message);
    setEditModalVisible(true);
  };

  // Update report
  const handleUpdate = async () => {
    if (!name || !email || !message) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      setLoading(true);
      await axios.put(`${API}/${editingReport._id}`, {
        name,
        email,
        issueType,
        message,
      });
      Alert.alert("Success", "Report updated");
      setEditModalVisible(false);
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setIssueType("Parking");
      fetchReports();
    } catch (error) {
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper: get status color and icon
  const getStatusStyle = (status) => {
    const isResolved = status === "Resolved";
    return {
      bg: isResolved ? "#dcfce7" : "#fee2e2",
      text: isResolved ? "#16a34a" : "#dc2626",
      icon: isResolved ? "checkmark-circle" : "time-outline",
    };
  };

  // Helper: get icon for issue type
  const getIssueIcon = (type) => {
    switch (type?.toLowerCase()) {
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

  // Render report item
  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const date = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "Recently";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Ionicons
              name={getIssueIcon(item.issueType)}
              size={24}
              color="#2563eb"
            />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.issueType}</Text>
            <Text style={styles.cardName}>{item.name}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditModal(item)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id)}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.cardMessage} numberOfLines={3}>
          {item.message}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.emailContainer}>
            <Ionicons name="mail-outline" size={14} color="#94a3b8" />
            <Text style={styles.email}>{item.email}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <Ionicons
              name={statusStyle.icon}
              size={12}
              color={statusStyle.text}
            />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status || "Pending"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Empty list component
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={70} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No Reports Yet</Text>
      <Text style={styles.emptyText}>Submit your first report above</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="flag" size={40} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <Text style={styles.headerSubtitle}>
            Help us improve by reporting parking, payment, or technical problems
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#94a3b8"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your full name"
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <Text style={styles.sectionLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#94a3b8"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="you@example.com"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <Text style={styles.sectionLabel}>Issue Type</Text>
          <View style={styles.chipContainer}>
            {["Parking", "Payment", "Bug", "Other"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, issueType === type && styles.chipActive]}
                onPress={() => setIssueType(type)}
              >
                <Text
                  style={[
                    styles.chipText,
                    issueType === type && styles.chipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Message</Text>
          <View style={[styles.inputWrapper, { alignItems: "flex-start" }]}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color="#94a3b8"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Describe your issue in detail..."
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Reports List Section */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Your Reports</Text>
            <View style={styles.listBadge}>
              <Text style={styles.listBadgeText}>{reports.length}</Text>
            </View>
          </View>

          {fetching ? (
            <ActivityIndicator
              size="large"
              color="#2563eb"
              style={{ marginVertical: 30 }}
            />
          ) : (
            <FlatList
              data={reports}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              scrollEnabled={false}
              ListEmptyComponent={EmptyList}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Report</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full name"
                />
              </View>

              <Text style={styles.modalLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </View>

              <Text style={styles.modalLabel}>Issue Type</Text>
              <View style={styles.chipContainer}>
                {["Parking", "Payment", "Bug", "Other"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chip,
                      issueType === type && styles.chipActive,
                    ]}
                    onPress={() => setIssueType(type)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        issueType === type && styles.chipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Message</Text>
              <View style={[styles.inputWrapper, { alignItems: "flex-start" }]}>
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe your issue"
                />
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.updateButtonText}>Update Report</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#2563eb",
    paddingTop: 45,
    paddingBottom: 35,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  chipTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 30,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  listBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  listBadgeText: {
    fontWeight: "700",
    color: "#2563eb",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f2f5",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  cardName: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#2563eb",
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardMessage: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    gap: 10,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  email: {
    fontSize: 12,
    color: "#64748b",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 30,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 8,
  },
  updateButton: {
    backgroundColor: "#2563eb",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 15,
  },
});
