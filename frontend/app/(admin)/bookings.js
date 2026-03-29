import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { allBookings as initialBookings } from '../../src/data/parkingData';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

const statusFilters = ['all', 'pending', 'upcoming', 'completed', 'cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredBookings = activeFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return colors.primary;
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return 'time-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'pending': return 'hourglass-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const handleStatusChange = (booking, newStatus) => {
    Alert.alert(
      'Update Status',
      `Change booking status to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setBookings(
              bookings.map((b) =>
                b.id === booking.id ? { ...b, status: newStatus } : b
              )
            );
            Alert.alert('Success', 'Booking status updated');
          },
        },
      ]
    );
  };

  const renderFilterChip = (filter) => {
    const isActive = activeFilter === filter;
    const count = filter === 'all'
      ? bookings.length
      : bookings.filter((b) => b.status === filter).length;

    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </Text>
        <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
          <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBookingItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Ionicons name={getStatusIcon(item.status)} size={14} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.bookingId}>#{item.id}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.userName.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userEmail}>{item.userEmail}</Text>
          </View>
          <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="car-sport-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{item.parkingName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.startTime} - {item.endTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="grid-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>Slot: {item.slotNumber}</Text>
          </View>
        </View>

        {(item.status === 'pending' || item.status === 'upcoming') && (
          <View style={styles.actionsRow}>
            {item.status === 'pending' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleStatusChange(item, 'upcoming')}
              >
                <Ionicons name="checkmark" size={16} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>Approve</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusChange(item, 'completed')}
            >
              <Ionicons name="checkmark-done" size={16} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleStatusChange(item, 'cancelled')}
            >
              <Ionicons name="close" size={16} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Calculate stats
  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Admin Panel</Text>
          <Text style={styles.title}>Manage Bookings</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={20} color={colors.success} />
          <Text style={styles.statValue}>${totalRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="list-outline" size={20} color={colors.primary} />
          <Text style={styles.statValue}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="hourglass-outline" size={20} color={colors.warning} />
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
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
            <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        }
      />
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  filterContainer: {
    marginTop: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.textWhite,
  },
  filterBadge: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterBadgeTextActive: {
    color: colors.textWhite,
  },
  listContent: {
    padding: spacing.md,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  bookingId: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '500',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textWhite,
  },
  userDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  bookingDetails: {
    marginTop: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  approveButton: {
    backgroundColor: colors.success + '10',
  },
  completeButton: {
    backgroundColor: colors.primary + '10',
  },
  cancelButton: {
    backgroundColor: colors.danger + '10',
    marginRight: 0,
  },
  actionText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
