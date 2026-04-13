import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../../src/styles/theme";
import {
  getParkings,
  createParking,
  updateParking,
  deleteParking,
  markFull,
} from "../../src/api/parkingApi.js";

const { width } = Dimensions.get("window");

export default function AdminParkings() {
  const [parkings, setParkings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pricePerHour: "",
    totalSlots: "",
    availableSlots: "",
  });

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const res = await getParkings();
      setParkings(res.data.parkings);
    } catch (error) {
      console.log("Fetch Error:", error);
      Alert.alert("Error", "Failed to load parkings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchParkings();
  };

  const filteredParkings = (parkings || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddModal = () => {
    setEditingParking(null);
    setFormData({
      name: "",
      address: "",
      pricePerHour: "",
      totalSlots: "",
      availableSlots: "",
    });
    setModalVisible(true);
  };

  const openEditModal = (parking) => {
    setEditingParking(parking);
    setFormData({
      name: parking.name,
      address: parking.address,
      pricePerHour: String(parking.pricePerHour),
      totalSlots: String(parking.totalSlots),
      availableSlots: String(parking.availableSlots),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.pricePerHour) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      if (editingParking) {
        await updateParking(editingParking._id, {
          name: formData.name,
          address: formData.address,
          pricePerHour: Number(formData.pricePerHour),
          totalSlots: Number(formData.totalSlots),
          availableSlots: Number(formData.availableSlots),
        });
        Alert.alert("Success", "Parking updated successfully");
      } else {
        await createParking({
          name: formData.name,
          address: formData.address,
          pricePerHour: Number(formData.pricePerHour),
          totalSlots: Number(formData.totalSlots),
        });
        Alert.alert("Success", "Parking created successfully");
      }
      fetchParkings();
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Operation failed");
    }
  };

  const handleDelete = (parking) => {
    Alert.alert(
      "Delete Parking",
      `Are you sure you want to delete "${parking.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteParking(parking._id);
              fetchParkings();
              Alert.alert("Success", "Parking deleted");
            } catch {
              Alert.alert("Error", "Delete failed");
            }
          },
        },
      ],
    );
  };

  const toggleAvailability = async (parking) => {
    try {
      await markFull(parking._id);
      fetchParkings();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const getOccupancyRate = (available, total) => {
    if (!total) return 0;
    return ((total - available) / total) * 100;
  };

  const renderParkingItem = ({ item }) => {
    const isAvailable = item.availableSlots > 0;
    const occupancyRate = getOccupancyRate(
      item.availableSlots,
      item.totalSlots,
    );

    return (
      <TouchableOpacity
        style={styles.parkingCard}
        onPress={() => openEditModal(item)}
        activeOpacity={0.9}
      >
        {/* Card Header with Gradient */}
        <LinearGradient
          colors={
            isAvailable
              ? [colors.success, "#2EB872"]
              : [colors.danger, "#FF453A"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardGradient}
        >
          <View style={styles.statusSection}>
            <Ionicons
              name={isAvailable ? "checkmark-circle" : "close-circle"}
              size={16}
              color="#FFF"
            />
            <Text style={styles.statusText}>
              {isAvailable ? "Available" : "Full"}
            </Text>
          </View>
          <Text style={styles.parkingId}>ID: {item._id?.slice(-6)}</Text>
        </LinearGradient>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <View style={styles.parkingHeader}>
            <View style={styles.parkingIcon}>
              <Ionicons name="car-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.parkingInfo}>
              <Text style={styles.parkingName}>{item.name}</Text>
              <View style={styles.addressRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={styles.address} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceCurrency}>₹</Text>
              <Text style={styles.priceValue}>
                {Number(item.pricePerHour || 0).toFixed(0)}
              </Text>
              <Text style={styles.perHour}>/hr</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons
                name="layers-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.statNumber}>{item.totalSlots || 0}</Text>
              <Text style={styles.statLabel}>Total Slots</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.success}
              />
              <Text style={[styles.statNumber, { color: colors.success }]}>
                {item.availableSlots || 0}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="trending-up" size={20} color={colors.warning} />
              <Text style={styles.statNumber}>
                {Math.round(occupancyRate)}%
              </Text>
              <Text style={styles.statLabel}>Occupancy</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${occupancyRate}%` },
                  isAvailable ? styles.progressAvailable : styles.progressFull,
                ]}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => openEditModal(item)}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.actionBtnText, styles.editBtnText]}>
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                isAvailable ? styles.fullBtn : styles.openBtn,
              ]}
              onPress={() => toggleAvailability(item)}
            >
              <Ionicons
                name={isAvailable ? "close-outline" : "checkmark-outline"}
                size={18}
                color={isAvailable ? colors.warning : colors.success}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  isAvailable ? styles.fullBtnText : styles.openBtnText,
                ]}
              >
                {isAvailable ? "Mark Full" : "Open"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[styles.actionBtnText, styles.deleteBtnText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const totalParkings = parkings.length;
  const availableParkings = parkings.filter((p) => p.availableSlots > 0).length;
  const totalSlots = parkings.reduce((sum, p) => sum + (p.totalSlots || 0), 0);
  const occupiedSlots = parkings.reduce(
    (sum, p) => sum + ((p.totalSlots || 0) - (p.availableSlots || 0)),
    0,
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading parkings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerBadge}>Admin Panel</Text>
            <Text style={styles.headerTitle}>Manage Parkings</Text>
            <Text style={styles.headerSubtitle}>
              {totalParkings} parking locations
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsOverview}>
        <View style={styles.statOverviewCard}>
          <Ionicons name="business-outline" size={22} color={colors.primary} />
          <Text style={styles.statOverviewValue}>{totalParkings}</Text>
          <Text style={styles.statOverviewLabel}>Total Parkings</Text>
        </View>
        <View style={styles.statOverviewCard}>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={colors.success}
          />
          <Text style={styles.statOverviewValue}>{availableParkings}</Text>
          <Text style={styles.statOverviewLabel}>Available</Text>
        </View>
        <View style={styles.statOverviewCard}>
          <Ionicons name="car-outline" size={22} color={colors.warning} />
          <Text style={styles.statOverviewValue}>
            {occupiedSlots}/{totalSlots}
          </Text>
          <Text style={styles.statOverviewLabel}>Slots Filled</Text>
        </View>
      </View>

      {/* Parking List */}
      <FlatList
        data={filteredParkings}
        keyExtractor={(item) => item._id}
        renderItem={renderParkingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No parkings found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Try adjusting your search"
                : "Tap + to add your first parking"}
            </Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>
                {editingParking ? "Edit Parking" : "Add New Parking"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Parking Name *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter parking name"
                    placeholderTextColor={colors.textLight}
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, name: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter full address"
                    placeholderTextColor={colors.textLight}
                    value={formData.address}
                    onChangeText={(text) =>
                      setFormData({ ...formData, address: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View
                  style={[
                    styles.formGroup,
                    { flex: 1, marginRight: spacing.sm },
                  ]}
                >
                  <Text style={styles.formLabel}>Price/Hour *</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="cash-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder="0"
                      placeholderTextColor={colors.textLight}
                      keyboardType="decimal-pad"
                      value={formData.pricePerHour}
                      onChangeText={(text) =>
                        setFormData({ ...formData, pricePerHour: text })
                      }
                    />
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Total Slots</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="layers-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder="50"
                      placeholderTextColor={colors.textLight}
                      keyboardType="number-pad"
                      value={formData.totalSlots}
                      onChangeText={(text) =>
                        setFormData({ ...formData, totalSlots: text })
                      }
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Available Slots</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter available slots"
                    placeholderTextColor={colors.textLight}
                    keyboardType="number-pad"
                    value={formData.availableSlots}
                    onChangeText={(text) =>
                      setFormData({ ...formData, availableSlots: text })
                    }
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {editingParking ? "Update Parking" : "Create Parking"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerBadge: {
    fontSize: fontSize.sm,
    color: colors.textWhite + "CC",
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textWhite + "CC",
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.textWhite + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  statsOverview: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    gap: spacing.sm,
  },
  statOverviewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: "center",
    ...shadows.md,
  },
  statOverviewValue: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statOverviewLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  parkingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.lg,
  },
  cardGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textWhite,
    letterSpacing: 0.5,
  },
  parkingId: {
    fontSize: fontSize.xs,
    fontWeight: "500",
    color: colors.textWhite + "CC",
  },
  cardContent: {
    padding: spacing.md,
  },
  parkingHeader: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  parkingIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  parkingInfo: {
    flex: 1,
  },
  parkingName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceCurrency: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
  },
  priceValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  perHour: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  statNumber: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressAvailable: {
    backgroundColor: colors.success,
  },
  progressFull: {
    backgroundColor: colors.danger,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  editBtn: {
    backgroundColor: colors.primary + "10",
  },
  fullBtn: {
    backgroundColor: colors.warning + "10",
  },
  openBtn: {
    backgroundColor: colors.success + "10",
  },
  deleteBtn: {
    backgroundColor: colors.danger + "10",
  },
  actionBtnText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  editBtnText: {
    color: colors.primary,
  },
  fullBtnText: {
    color: colors.warning,
  },
  openBtnText: {
    color: colors.success,
  },
  deleteBtnText: {
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textWhite,
  },
  modalBody: {
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formRow: {
    flexDirection: "row",
  },
  formLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  saveButtonGradient: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textWhite,
  },
});
