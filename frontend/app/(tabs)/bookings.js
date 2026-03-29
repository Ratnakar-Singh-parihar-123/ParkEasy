import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userBookings } from '../../src/data/parkingData';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return 'time-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const statusColor = getStatusColor(booking.status);

  return (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <Ionicons name={getStatusIcon(booking.status)} size={14} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.slotNumber}>Slot: {booking.slotNumber}</Text>
      </View>

      <Text style={styles.parkingName}>{booking.parkingName}</Text>
      
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.address} numberOfLines={1}>
          {booking.address}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{booking.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={styles.detailText}>
            {booking.startTime} - {booking.endTime}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>Total Paid</Text>
        <Text style={styles.totalPrice}>${booking.totalPrice.toFixed(2)}</Text>
      </View>

      {booking.status === 'upcoming' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="navigate" size={18} color={colors.primary} />
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Ionicons name="close" size={18} color={colors.danger} />
            <Text style={[styles.actionText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function BookingsScreen() {
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>
        {userBookings.length} {userBookings.length === 1 ? 'booking' : 'bookings'}
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your parking reservations will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
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
  slotNumber: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  parkingName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  totalLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  actionsContainer: {
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
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  cancelButton: {
    backgroundColor: colors.danger + '10',
    marginRight: 0,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  cancelText: {
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
