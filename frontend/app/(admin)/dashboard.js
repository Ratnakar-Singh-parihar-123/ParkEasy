import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
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
  getRecentBookings,
  getDashboardStats,
} from "../../src/api/dashboardApi";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        getDashboardStats(),
        getRecentBookings(),
      ]);

      setDashboardStats(statsRes.data.stats);

      const formatted = bookingsRes.data.bookings.map((b) => ({
        ...b,
        id: b._id,
        userName: b.user?.name || "User",
        parkingName: b.parking?.name || "Parking",
        totalPrice: Number(b.totalPrice || 0),
      }));

      setAllBookings(formatted);
    } catch (error) {
      console.log("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const pendingBookings = allBookings.filter(
    (b) => b.status === "pending",
  ).length;
  const upcomingBookings = allBookings.filter(
    (b) => b.status === "upcoming",
  ).length;
  const recentBookings = (allBookings || []).slice(0, 5);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>Admin Panel</Text>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                Welcome back! Here's your overview
              </Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
              {pendingBookings > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {pendingBookings}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsWrapper}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconBg,
                  { backgroundColor: colors.success + "15" },
                ]}
              >
                <Ionicons
                  name="cash-outline"
                  size={28}
                  color={colors.success}
                />
              </View>
              <Text style={styles.statValue}>
                ₹{dashboardStats?.totalRevenue?.toFixed(0) || 0}
              </Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
              <Text style={styles.statTrend}>↑ +12% from last month</Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconBg,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={28}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statValue}>
                {dashboardStats?.totalBookings || 0}
              </Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
              <Text style={styles.statTrend}>
                {dashboardStats?.todayBookings || 0} today
              </Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconBg,
                  { backgroundColor: colors.warning + "15" },
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={28}
                  color={colors.warning}
                />
              </View>
              <Text style={styles.statValue}>
                {dashboardStats?.activeUsers || 0}
              </Text>
              <Text style={styles.statLabel}>Active Users</Text>
              <Text style={styles.statTrend}>Registered users</Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconBg,
                  { backgroundColor: colors.info + "15" },
                ]}
              >
                <Ionicons name="car-outline" size={28} color={colors.info} />
              </View>
              <Text style={styles.statValue}>
                {dashboardStats?.totalParkingSpots || 0}
              </Text>
              <Text style={styles.statLabel}>Parking Spots</Text>
              <Text style={styles.statTrend}>
                {dashboardStats?.occupancyRate || 0}% occupied
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.overviewContainer}>
            <View style={styles.overviewItem}>
              <Ionicons name="trending-up" size={24} color={colors.success} />
              <Text style={styles.overviewValue}>
                ₹{dashboardStats?.todayRevenue || 0}
              </Text>
              <Text style={styles.overviewLabel}>Revenue</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Ionicons name="bookmark" size={24} color={colors.primary} />
              <Text style={styles.overviewValue}>
                {dashboardStats?.todayBookings || 0}
              </Text>
              <Text style={styles.overviewLabel}>Bookings</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Ionicons name="pie-chart" size={24} color={colors.warning} />
              <Text style={styles.overviewValue}>
                {dashboardStats?.occupancyRate || 0}%
              </Text>
              <Text style={styles.overviewLabel}>Occupancy</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.quickActionIcon}
              >
                <Ionicons name="add-outline" size={28} color="#FFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Add Parking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={[colors.success, "#2EB872"]}
                style={styles.quickActionIcon}
              >
                <Ionicons name="eye-outline" size={28} color="#FFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>View Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={[colors.warning, "#FF9F0A"]}
                style={styles.quickActionIcon}
              >
                <Ionicons name="analytics-outline" size={28} color="#FFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={[colors.info, "#5E5CE6"]}
                style={styles.quickActionIcon}
              >
                <Ionicons name="settings-outline" size={28} color="#FFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Alerts Section */}
        {(pendingBookings > 0 || upcomingBookings > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerts & Notifications</Text>
            {pendingBookings > 0 && (
              <TouchableOpacity style={[styles.alertCard, styles.alertWarning]}>
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={colors.warning}
                />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Pending Approvals</Text>
                  <Text style={styles.alertMessage}>
                    {pendingBookings} booking(s) waiting for your approval
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.warning}
                />
              </TouchableOpacity>
            )}

            {upcomingBookings > 0 && (
              <TouchableOpacity style={[styles.alertCard, styles.alertInfo]}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={colors.primary}
                />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Upcoming Bookings</Text>
                  <Text style={styles.alertMessage}>
                    {upcomingBookings} booking(s) scheduled for today
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentBookingsContainer}>
            {recentBookings.map((booking, index) => (
              <View
                key={booking.id}
                style={[
                  styles.bookingItem,
                  index === recentBookings.length - 1 && styles.lastBookingItem,
                ]}
              >
                <View style={styles.bookingAvatar}>
                  <Text style={styles.bookingAvatarText}>
                    {booking.userName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingUserName}>{booking.userName}</Text>
                  <Text style={styles.bookingParkingName}>
                    {booking.parkingName}
                  </Text>
                </View>
                <View style={styles.bookingRight}>
                  <Text style={styles.bookingPrice}>
                    ₹{booking.totalPrice.toFixed(0)}
                  </Text>
                  <View
                    style={[
                      styles.bookingStatus,
                      booking.status === "completed" && styles.statusCompleted,
                      booking.status === "pending" && styles.statusPending,
                      booking.status === "upcoming" && styles.statusUpcoming,
                    ]}
                  >
                    <Text style={styles.bookingStatusText}>
                      {booking.status === "completed"
                        ? "Done"
                        : booking.status === "pending"
                          ? "Pending"
                          : "Upcoming"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
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
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
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
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.textWhite + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textWhite,
  },
  statsWrapper: {
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 3 * spacing.lg) / 2 - spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.md,
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statTrend: {
    fontSize: fontSize.xs,
    color: colors.success,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  overviewContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  overviewItem: {
    flex: 1,
    alignItems: "center",
  },
  overviewValue: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  overviewLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  overviewDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: (width - 3 * spacing.lg) / 4 - spacing.md,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  quickActionText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: "center",
    fontWeight: "500",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  alertWarning: {
    backgroundColor: colors.warning + "10",
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  alertInfo: {
    backgroundColor: colors.primary + "10",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  recentBookingsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.md,
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  lastBookingItem: {
    borderBottomWidth: 0,
  },
  bookingAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  bookingAvatarText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingUserName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  bookingParkingName: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  bookingRight: {
    alignItems: "flex-end",
  },
  bookingPrice: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  bookingStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusCompleted: {
    backgroundColor: colors.success + "15",
  },
  statusPending: {
    backgroundColor: colors.warning + "15",
  },
  statusUpcoming: {
    backgroundColor: colors.primary + "15",
  },
  bookingStatusText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
