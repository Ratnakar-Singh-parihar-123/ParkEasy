import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
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

const statusFilters = ["all", "pending", "upcoming", "completed", "cancelled"];

import {
  getBookings,
  completeBooking,
  cancelBookingApi,
} from "../../src/api/userApi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings();

      const formatted = res.data.bookings.map((b) => ({
        ...b,
        id: b._id,
        userName: b.user?.name || "User",
        userEmail: b.user?.email || "",
        parkingName: b.parking?.name || "Parking",
        userAvatar: b.user?.name?.charAt(0) || "U",
      }));

      setBookings(formatted);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = activeFilter === "all" || b.status === activeFilter;
    const matchesSearch =
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.parkingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (booking, newStatus) => {
    Alert.alert(
      "Update Status",
      `Change booking to "${newStatus.toUpperCase()}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              if (newStatus === "completed") {
                await completeBooking(booking.id);
              } else if (newStatus === "cancelled") {
                await cancelBookingApi(booking.id);
              }
              fetchBookings();
              Alert.alert("Success", `Booking marked as ${newStatus}`);
            } catch {
              Alert.alert("Error", "Update failed");
            }
          },
        },
      ],
    );
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: colors.warning + "15",
        text: colors.warning,
        icon: "time-outline",
        label: "Pending",
        gradient: ["#FF9500", "#FF9F0A"],
      },
      upcoming: {
        bg: colors.info + "15",
        text: colors.info,
        icon: "calendar-outline",
        label: "Upcoming",
        gradient: ["#5856D6", "#5E5CE6"],
      },
      completed: {
        bg: colors.success + "15",
        text: colors.success,
        icon: "checkmark-circle-outline",
        label: "Completed",
        gradient: ["#4CD964", "#2EB872"],
      },
      cancelled: {
        bg: colors.danger + "15",
        text: colors.danger,
        icon: "close-circle-outline",
        label: "Cancelled",
        gradient: ["#FF3B30", "#FF453A"],
      },
    };
    return configs[status] || configs.pending;
  };

  const renderBookingItem = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);
    const isActionable =
      item.status === "pending" || item.status === "upcoming";

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => {
          setSelectedBooking(item);
          setShowDetailsModal(true);
        }}
        activeOpacity={0.9}
      >
        {/* Status Header */}
        <LinearGradient
          colors={statusConfig.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardHeaderGradient}
        >
          <View style={styles.statusSection}>
            <Ionicons name={statusConfig.icon} size={14} color="#FFF" />
            <Text style={styles.statusLabel}>{statusConfig.label}</Text>
          </View>
          <Text style={styles.bookingId}>#{item.id.slice(-6)}</Text>
        </LinearGradient>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{item.userAvatar}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.userEmail}>{item.userEmail}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceCurrency}>₹</Text>
              <Text style={styles.priceValue}>
                {Number(item.totalPrice || 0).toFixed(0)}
              </Text>
            </View>
          </View>

          {/* Parking Info */}
          <View style={styles.parkingSection}>
            <View style={styles.parkingIcon}>
              <Ionicons name="car-outline" size={16} color={colors.primary} />
            </View>
            <Text style={styles.parkingName}>{item.parkingName}</Text>
          </View>

          {/* Date & Time */}
          <View style={styles.datetimeRow}>
            <View style={styles.datetimeItem}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.datetimeText}>{item.date}</Text>
            </View>
            <View style={styles.datetimeItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.datetimeText}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {isActionable && (
            <View style={styles.actionsRow}>
              {item.status === "pending" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleStatusChange(item, "upcoming")}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={colors.success}
                  />
                  <Text style={[styles.actionBtnText, styles.approveText]}>
                    Approve
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionBtn, styles.completeBtn]}
                onPress={() => handleStatusChange(item, "completed")}
              >
                <Ionicons name="flag-outline" size={18} color={colors.info} />
                <Text style={[styles.actionBtnText, styles.completeText]}>
                  Complete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelActionBtn]}
                onPress={() => handleStatusChange(item, "cancelled")}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color={colors.danger}
                />
                <Text style={[styles.actionBtnText, styles.cancelActionText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Stats Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const getFilterCount = (filter) => {
    if (filter === "all") return bookings.length;
    return bookings.filter((b) => b.status === filter).length;
  };

  const renderFilterChip = (filter) => {
    const isActive = activeFilter === filter;
    const count = getFilterCount(filter);
    const filterLabels = {
      all: "All",
      pending: "Pending",
      upcoming: "Upcoming",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <TouchableOpacity
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text
          style={[
            styles.filterChipText,
            isActive && styles.filterChipTextActive,
          ]}
        >
          {filterLabels[filter]}
        </Text>
        {filter !== "all" && (
          <View
            style={[styles.filterBadge, isActive && styles.filterBadgeActive]}
          >
            <Text
              style={[
                styles.filterBadgeText,
                isActive && styles.filterBadgeTextActive,
              ]}
            >
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const DetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDetailsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Booking Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>

          {selectedBooking && (
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  Customer Information
                </Text>
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.userName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.userEmail}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Parking Details</Text>
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="car-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Parking:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.parkingName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="layers-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Slot:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.slotNumber || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Booking Schedule</Text>
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.date}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Time:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.startTime} - {selectedBooking.endTime}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  Payment Information
                </Text>
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="cash-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={[styles.detailValue, styles.priceHighlight]}>
                      ₹{Number(selectedBooking.totalPrice || 0).toFixed(0)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.status}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.badge}>Admin Panel</Text>
            <Text style={styles.title}>Manage Bookings</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchBookings}
          >
            <Ionicons name="refresh-outline" size={22} color="#FFF" />
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
            placeholder="Search by name, email or parking..."
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

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.revenueCard]}>
            <Ionicons name="cash-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>₹{totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={[styles.statCard, styles.totalCard]}>
            <Ionicons name="list-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.pendingCard]}>
            <Ionicons name="time-outline" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.upcomingCard]}>
            <Ionicons name="calendar-outline" size={24} color={colors.info} />
            <Text style={styles.statValue}>{upcomingCount}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={[styles.statCard, styles.completedStatCard]}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={colors.success}
            />
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          data={statusFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(item)}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.textLight}
            />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Try adjusting your search"
                : "Bookings will appear here"}
            </Text>
          </View>
        }
      />

      <DetailsModal />
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
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  badge: {
    fontSize: fontSize.sm,
    color: colors.textWhite + "CC",
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.textWhite,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
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
  statsContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.md,
  },
  revenueCard: {
    borderTopWidth: 3,
    borderTopColor: colors.success,
  },
  totalCard: {
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  pendingCard: {
    borderTopWidth: 3,
    borderTopColor: colors.warning,
  },
  upcomingCard: {
    borderTopWidth: 3,
    borderTopColor: colors.info,
  },
  completedStatCard: {
    borderTopWidth: 3,
    borderTopColor: colors.success,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    ...shadows.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: colors.textWhite,
  },
  filterBadge: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  filterBadgeActive: {
    backgroundColor: colors.textWhite + "30",
  },
  filterBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterBadgeTextActive: {
    color: colors.textWhite,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.lg,
  },
  cardHeaderGradient: {
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
  statusLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.textWhite,
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textWhite + "CC",
  },
  cardContent: {
    padding: spacing.md,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
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
  parkingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  parkingIcon: {
    marginRight: spacing.sm,
  },
  parkingName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  datetimeRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  datetimeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  datetimeText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
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
  approveBtn: {
    backgroundColor: colors.success + "10",
  },
  completeBtn: {
    backgroundColor: colors.info + "10",
  },
  cancelActionBtn: {
    backgroundColor: colors.danger + "10",
  },
  actionBtnText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  approveText: {
    color: colors.success,
  },
  completeText: {
    color: colors.info,
  },
  cancelActionText: {
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
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
  detailSection: {
    marginBottom: spacing.lg,
  },
  detailSectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  detailCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    width: 60,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  priceHighlight: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
  },
});
