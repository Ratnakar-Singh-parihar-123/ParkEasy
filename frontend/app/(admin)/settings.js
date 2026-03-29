import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

const MenuItem = ({ icon, title, subtitle, onPress, showChevron = true, danger = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
      <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.primary} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    )}
  </TouchableOpacity>
);

export default function AdminSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleSwitchToUser = () => {
    Alert.alert(
      'Switch View',
      'Switch to user view? You will need to login again as user.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Admin Panel</Text>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Admin Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="shield-checkmark" size={32} color={colors.textWhite} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Admin'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'admin@gmail.com'}</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Administrator</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.quickStatLabel}>Last Login</Text>
            <Text style={styles.quickStatValue}>Today, 9:30 AM</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Ionicons name="shield-outline" size={20} color={colors.success} />
            <Text style={styles.quickStatLabel}>Role</Text>
            <Text style={styles.quickStatValue}>Super Admin</Text>
          </View>
        </View>

        {/* App Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Management</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="business-outline"
              title="Business Settings"
              subtitle="Name, logo, contact info"
              onPress={() => {}}
            />
            <MenuItem
              icon="pricetag-outline"
              title="Pricing Rules"
              subtitle="Set default pricing, discounts"
              onPress={() => {}}
            />
            <MenuItem
              icon="time-outline"
              title="Operating Hours"
              subtitle="Default open/close times"
              onPress={() => {}}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Push, email settings"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports & Analytics</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="bar-chart-outline"
              title="Revenue Reports"
              subtitle="Daily, weekly, monthly"
              onPress={() => {}}
            />
            <MenuItem
              icon="analytics-outline"
              title="Booking Analytics"
              subtitle="Trends and insights"
              onPress={() => {}}
            />
            <MenuItem
              icon="people-outline"
              title="User Reports"
              subtitle="Registrations, activity"
              onPress={() => {}}
            />
            <MenuItem
              icon="download-outline"
              title="Export Data"
              subtitle="CSV, PDF exports"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* System Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="key-outline"
              title="Change Password"
              subtitle="Update admin password"
              onPress={() => {}}
            />
            <MenuItem
              icon="swap-horizontal-outline"
              title="Switch to User View"
              subtitle="View app as user"
              onPress={handleSwitchToUser}
            />
            <MenuItem
              icon="information-circle-outline"
              title="App Version"
              subtitle="v1.0.0 (Build 1)"
              showChevron={false}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="log-out-outline"
              title="Logout"
              onPress={handleLogout}
              showChevron={false}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ParkEasy Admin Panel</Text>
          <Text style={styles.footerSubtext}>© 2025 All rights reserved</Text>
        </View>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textWhite,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textWhite,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  quickStatValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: colors.danger + '10',
  },
  menuContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuTitleDanger: {
    color: colors.danger,
  },
  menuSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footerSubtext: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});
