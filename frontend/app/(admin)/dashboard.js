import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dashboardStats, allBookings, parkingSpots } from '../../src/data/parkingData';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

const StatCard = ({ icon, iconColor, title, value, subtitle, bgColor }) => (
  <View style={[styles.statCard, { backgroundColor: bgColor || colors.surface }]}>
    <View style={[styles.statIconContainer, { backgroundColor: iconColor + '20' }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

const QuickAction = ({ icon, title, onPress, color }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const RecentBookingItem = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return colors.primary;
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.recentBookingItem}>
      <View style={styles.recentBookingLeft}>
        <Text style={styles.recentBookingName}>{booking.userName}</Text>
        <Text style={styles.recentBookingParking}>{booking.parkingName}</Text>
      </View>
      <View style={styles.recentBookingRight}>
        <Text style={styles.recentBookingPrice}>${booking.totalPrice.toFixed(2)}</Text>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(booking.status) }]} />
      </View>
    </View>
  );
};

export default function AdminDashboard() {
  const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
  const upcomingBookings = allBookings.filter(b => b.status === 'upcoming').length;
  const recentBookings = allBookings.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Admin Panel</Text>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            {pendingBookings > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingBookings}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="cash"
            iconColor={colors.success}
            title="Total Revenue"
            value={`$${dashboardStats.totalRevenue.toFixed(0)}`}
            subtitle="All time"
          />
          <StatCard
            icon="calendar"
            iconColor={colors.primary}
            title="Total Bookings"
            value={dashboardStats.totalBookings}
            subtitle="All time"
          />
          <StatCard
            icon="people"
            iconColor={colors.warning}
            title="Active Users"
            value={dashboardStats.activeUsers}
            subtitle="Registered"
          />
          <StatCard
            icon="car-sport"
            iconColor={colors.info}
            title="Parking Spots"
            value={dashboardStats.totalParkingSpots}
            subtitle="Managed"
          />
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.todayStats}>
            <View style={styles.todayStatItem}>
              <Ionicons name="trending-up" size={20} color={colors.success} />
              <View style={styles.todayStatInfo}>
                <Text style={styles.todayStatValue}>${dashboardStats.todayRevenue}</Text>
                <Text style={styles.todayStatLabel}>Revenue</Text>
              </View>
            </View>
            <View style={styles.todayStatDivider} />
            <View style={styles.todayStatItem}>
              <Ionicons name="bookmark" size={20} color={colors.primary} />
              <View style={styles.todayStatInfo}>
                <Text style={styles.todayStatValue}>{dashboardStats.todayBookings}</Text>
                <Text style={styles.todayStatLabel}>Bookings</Text>
              </View>
            </View>
            <View style={styles.todayStatDivider} />
            <View style={styles.todayStatItem}>
              <Ionicons name="pie-chart" size={20} color={colors.warning} />
              <View style={styles.todayStatInfo}>
                <Text style={styles.todayStatValue}>{dashboardStats.occupancyRate}%</Text>
                <Text style={styles.todayStatLabel}>Occupancy</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction icon="add-circle" title="Add Parking" color={colors.primary} />
            <QuickAction icon="eye" title="View Bookings" color={colors.success} />
            <QuickAction icon="analytics" title="Reports" color={colors.warning} />
            <QuickAction icon="settings" title="Settings" color={colors.info} />
          </View>
        </View>

        {/* Alerts */}
        {(pendingBookings > 0 || upcomingBookings > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            {pendingBookings > 0 && (
              <View style={[styles.alertCard, styles.alertWarning]}>
                <Ionicons name="time" size={20} color={colors.warning} />
                <Text style={styles.alertText}>
                  {pendingBookings} booking(s) pending approval
                </Text>
              </View>
            )}
            {upcomingBookings > 0 && (
              <View style={[styles.alertCard, styles.alertInfo]}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={styles.alertText}>
                  {upcomingBookings} upcoming booking(s) this week
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentBookingsCard}>
            {recentBookings.map((booking, index) => (
              <RecentBookingItem key={booking.id} booking={booking} />
            ))}
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textWhite,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  todayStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  todayStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayStatInfo: {
    marginLeft: spacing.sm,
  },
  todayStatValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  todayStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  todayStatDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -spacing.sm,
  },
  quickAction: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  alertWarning: {
    backgroundColor: colors.warning + '15',
  },
  alertInfo: {
    backgroundColor: colors.primary + '15',
  },
  alertText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  recentBookingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    ...shadows.sm,
  },
  recentBookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  recentBookingLeft: {
    flex: 1,
  },
  recentBookingName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  recentBookingParking: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recentBookingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentBookingPrice: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
