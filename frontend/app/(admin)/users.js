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
  ActivityIndicator,
  Dimensions,
  RefreshControl,
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

import {
  getUsers,
  deactivateUserApi,
  activateUserApi,
} from "../../src/api/userApi";

const { width } = Dimensions.get("window");

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      const formatted = res.data.users.map((u) => ({
        ...u,
        id: u._id,
        status: u.isActive ? "active" : "inactive",
        memberSince: new Date(u.createdAt).toLocaleDateString(),
        totalBookings: u.bookings?.length || 0,
        totalSpent: u.totalSpent || 0,
      }));
      setUsers(formatted);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleToggleStatus = (user) => {
    const isActive = user.status === "active";
    Alert.alert(
      "Update Status",
      `Are you sure you want to ${isActive ? "deactivate" : "activate"} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              if (isActive) {
                await deactivateUserApi(user._id);
              } else {
                await activateUserApi(user._id);
              }
              fetchUsers();
              setModalVisible(false);
              Alert.alert(
                "Success",
                `User ${isActive ? "deactivated" : "activated"} successfully`,
              );
            } catch {
              Alert.alert("Error", "Status update failed");
            }
          },
        },
      ],
    );
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name) => {
    const colors = [
      "#4CD964",
      "#5856D6",
      "#FF9500",
      "#FF3B30",
      "#5E5CE6",
      "#AF52DE",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderUserItem = ({ item }) => {
    const isActive = item.status === "active";
    const avatarColor = getRandomColor(item.name);

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleViewUser(item)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={
            isActive
              ? [colors.success + "20", colors.success + "05"]
              : [colors.danger + "20", colors.danger + "05"]
          }
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isActive ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    isActive ? styles.dotActive : styles.dotInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    isActive
                      ? styles.statusTextActive
                      : styles.statusTextInactive,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.primary}
                />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{item.totalBookings}</Text>
                  <Text style={styles.statLabel}>Bookings</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={colors.success}
                />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>
                    ₹{Number(item.totalSpent || 0).toFixed(0)}
                  </Text>
                  <Text style={styles.statLabel}>Spent</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="car-outline" size={18} color={colors.warning} />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>
                    {item.vehicleNumber || "N/A"}
                  </Text>
                  <Text style={styles.statLabel}>Vehicle</Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.memberSince}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.textLight}
                />
                <Text style={styles.memberSinceText}>
                  Joined {item.memberSince}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewUser(item)}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  const totalSpent = users.reduce(
    (sum, u) => sum + Number(u.totalSpent || 0),
    0,
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
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
            <Text style={styles.headerTitle}>Manage Users</Text>
            <Text style={styles.headerSubtitle}>
              {users.length} total users registered
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh-outline" size={24} color="#FFF" />
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
            placeholder="Search by name or email..."
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
          <View
            style={[
              styles.statIconBg,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Ionicons name="people-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.statOverviewValue}>{users.length}</Text>
          <Text style={styles.statOverviewLabel}>Total Users</Text>
        </View>
        <View style={styles.statOverviewCard}>
          <View
            style={[
              styles.statIconBg,
              { backgroundColor: colors.success + "15" },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={colors.success}
            />
          </View>
          <Text style={[styles.statOverviewValue, { color: colors.success }]}>
            {activeUsers}
          </Text>
          <Text style={styles.statOverviewLabel}>Active</Text>
        </View>
        <View style={styles.statOverviewCard}>
          <View
            style={[
              styles.statIconBg,
              { backgroundColor: colors.danger + "15" },
            ]}
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color={colors.danger}
            />
          </View>
          <Text style={[styles.statOverviewValue, { color: colors.danger }]}>
            {inactiveUsers}
          </Text>
          <Text style={styles.statOverviewLabel}>Inactive</Text>
        </View>
        <View style={styles.statOverviewCard}>
          <View
            style={[
              styles.statIconBg,
              { backgroundColor: colors.warning + "15" },
            ]}
          >
            <Ionicons name="cash-outline" size={24} color={colors.warning} />
          </View>
          <Text style={styles.statOverviewValue}>₹{totalSpent.toFixed(0)}</Text>
          <Text style={styles.statOverviewLabel}>Total Spent</Text>
        </View>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={80}
              color={colors.textLight}
            />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Try adjusting your search"
                : "Users will appear here"}
            </Text>
          </View>
        }
      />

      {/* User Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.modalHeader}
                >
                  <Text style={styles.modalTitle}>User Profile</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#FFF" />
                  </TouchableOpacity>
                </LinearGradient>

                <ScrollView
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Avatar Section */}
                  <View style={styles.modalAvatarSection}>
                    <View
                      style={[
                        styles.modalAvatar,
                        { backgroundColor: getRandomColor(selectedUser.name) },
                      ]}
                    >
                      <Text style={styles.modalAvatarText}>
                        {getInitials(selectedUser.name)}
                      </Text>
                    </View>
                    <Text style={styles.modalUserName}>
                      {selectedUser.name}
                    </Text>
                    <Text style={styles.modalUserEmail}>
                      {selectedUser.email}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        selectedUser.status === "active"
                          ? styles.statusActive
                          : styles.statusInactive,
                        { marginTop: spacing.sm },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          selectedUser.status === "active"
                            ? styles.dotActive
                            : styles.dotInactive,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          selectedUser.status === "active"
                            ? styles.statusTextActive
                            : styles.statusTextInactive,
                        ]}
                      >
                        {selectedUser.status}
                      </Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>
                      Contact Information
                    </Text>
                    <View style={styles.infoCard}>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="call-outline"
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>
                          {selectedUser.phone || "Not provided"}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="car-outline"
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.infoLabel}>Vehicle:</Text>
                        <Text style={styles.infoValue}>
                          {selectedUser.vehicleNumber || "Not provided"}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.infoLabel}>Joined:</Text>
                        <Text style={styles.infoValue}>
                          {selectedUser.memberSince}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Activity Stats */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>
                      Activity Summary
                    </Text>
                    <View style={styles.statsContainer}>
                      <View style={styles.statBox}>
                        <Ionicons
                          name="bookmark-outline"
                          size={28}
                          color={colors.primary}
                        />
                        <Text style={styles.statBoxValue}>
                          {selectedUser.totalBookings}
                        </Text>
                        <Text style={styles.statBoxLabel}>Total Bookings</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Ionicons
                          name="cash-outline"
                          size={28}
                          color={colors.success}
                        />
                        <Text style={styles.statBoxValue}>
                          ₹{Number(selectedUser.totalSpent || 0).toFixed(0)}
                        </Text>
                        <Text style={styles.statBoxLabel}>Total Spent</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      selectedUser.status === "active"
                        ? styles.deactivateButton
                        : styles.activateButton,
                    ]}
                    onPress={() => handleToggleStatus(selectedUser)}
                  >
                    <LinearGradient
                      colors={
                        selectedUser.status === "active"
                          ? [colors.danger, "#FF453A"]
                          : [colors.success, "#2EB872"]
                      }
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons
                        name={
                          selectedUser.status === "active"
                            ? "close-circle-outline"
                            : "checkmark-circle-outline"
                        }
                        size={22}
                        color="#FFF"
                      />
                      <Text style={styles.actionButtonText}>
                        {selectedUser.status === "active"
                          ? "Deactivate User"
                          : "Activate User"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
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
  statsOverview: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statOverviewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: "center",
    ...shadows.md,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  statOverviewValue: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statOverviewLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  userCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  cardGradient: {
    padding: 1,
  },
  cardContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl - 1,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textWhite,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    gap: 4,
  },
  statusActive: {
    backgroundColor: colors.success + "15",
  },
  statusInactive: {
    backgroundColor: colors.danger + "15",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.success,
  },
  dotInactive: {
    backgroundColor: colors.danger,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextInactive: {
    color: colors.danger,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xs,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberSince: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  memberSinceText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary + "10",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  viewButtonText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.primary,
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
  modalAvatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  modalAvatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.textWhite,
  },
  modalUserName: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  modalUserEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  infoSectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    marginLeft: spacing.md,
    width: 60,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  statBoxValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  statBoxLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionButton: {
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  actionButtonText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textWhite,
  },
  deactivateButton: {
    marginTop: spacing.md,
  },
  activateButton: {
    marginTop: spacing.md,
  },
});
