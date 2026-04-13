import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
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

// ✅ API
import { getMyBookings, cancelBookingApi } from "../../src/api/userBookingApi";

const { width } = Dimensions.get("window");

// 🔥 REDESIGNED CARD COMPONENT
const BookingCard = ({ booking, onCancel }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "upcoming":
        return {
          bg: colors.success + "15",
          text: colors.success,
          icon: "calendar-clear-outline",
          label: "UPCOMING",
          gradient: ["#4CD964", "#2EB872"],
        };
      case "completed":
        return {
          bg: colors.info + "15",
          text: colors.info,
          icon: "checkmark-done-circle-outline",
          label: "COMPLETED",
          gradient: ["#5856D6", "#5E5CE6"],
        };
      case "cancelled":
        return {
          bg: colors.danger + "15",
          text: colors.danger,
          icon: "close-circle-outline",
          label: "CANCELLED",
          gradient: ["#FF3B30", "#FF453A"],
        };
      default:
        return {
          bg: colors.warning + "15",
          text: colors.warning,
          icon: "time-outline",
          label: "PENDING",
          gradient: ["#FF9500", "#FF9F0A"],
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const isUpcoming = booking.status === "upcoming";

  return (
    <View style={styles.bookingCard}>
      {/* Gradient Header */}
      <LinearGradient
        colors={statusConfig.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGradientHeader}
      >
        <View style={styles.statusSection}>
          <Ionicons name={statusConfig.icon} size={14} color="#FFF" />
          <Text style={styles.statusLabel}>{statusConfig.label}</Text>
        </View>
        <View style={styles.slotSection}>
          <Ionicons name="layers-outline" size={12} color="#FFF" />
          <Text style={styles.slotText}>
            Slot {booking.slotNumber || "N/A"}
          </Text>
        </View>
      </LinearGradient>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Parking Name & Icon */}
        <View style={styles.parkingHeader}>
          <View style={styles.parkingIconCircle}>
            <Ionicons name="car-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.parkingTitleSection}>
            <Text style={styles.parkingName}>{booking.parkingName}</Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.address} numberOfLines={1}>
                {booking.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Date & Time Details */}
        <View style={styles.datetimeContainer}>
          <View style={styles.datetimeItem}>
            <View style={styles.datetimeIcon}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.datetimeLabel}>Date</Text>
              <Text style={styles.datetimeValue}>{booking.date}</Text>
            </View>
          </View>

          <View style={styles.datetimeDivider} />

          <View style={styles.datetimeItem}>
            <View style={styles.datetimeIcon}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.datetimeLabel}>Time</Text>
              <Text style={styles.datetimeValue}>
                {booking.startTime} - {booking.endTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Price and Actions */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <View style={styles.priceRow}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.totalPrice}>
                {Number(booking.totalPrice || 0).toFixed(0)}
              </Text>
            </View>
          </View>

          {isUpcoming && (
            <TouchableOpacity
              style={styles.cancelBookingBtn}
              onPress={() => onCancel(booking)}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={styles.cancelBookingText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {booking.status === "completed" && (
            <View style={styles.completedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}

          {booking.status === "cancelled" && (
            <View style={styles.cancelledBadge}>
              <Ionicons name="alert-circle" size={20} color={colors.danger} />
              <Text style={styles.cancelledText}>Cancelled</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔥 FETCH FROM BACKEND
  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      console.log("API DATA:", res.data);

      const bookingsData = res?.data?.bookings || [];

      const formatted = bookingsData.map((b) => ({
        id: b._id,
        _id: b._id,
        parkingName: b.parking?.name || "Parking",
        address: b.parking?.address || "",
        totalPrice: Number(b.totalPrice || 0),
        status: b.status === "active" ? "upcoming" : b.status,
        slotNumber: b.slotNumber || "N/A",
        date: b.date || "",
        startTime: b.startTime || "",
        endTime: b.endTime || "",
      }));

      setBookings(formatted);
    } catch (error) {
      console.log("❌ Fetch Booking Error:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CANCEL BOOKING
  const handleCancel = (booking) => {
    Alert.alert("Cancel Booking", "Are you sure?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await cancelBookingApi(booking._id);
            fetchBookings();
          } catch {
            Alert.alert("Error", "Cancel failed");
          }
        },
      },
    ]);
  };

  const getUpcomingCount = () => {
    return bookings.filter((b) => b.status === "upcoming").length;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>My Bookings</Text>
      <View style={styles.headerStats}>
        <View style={styles.statChip}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary} />
          <Text style={styles.statChipText}>{bookings.length} Total</Text>
        </View>
        {getUpcomingCount() > 0 && (
          <View style={[styles.statChip, styles.upcomingChip]}>
            <Ionicons name="time-outline" size={14} color={colors.success} />
            <Text style={[styles.statChipText, { color: colors.success }]}>
              {getUpcomingCount()} Upcoming
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons
          name="calendar-outline"
          size={64}
          color={colors.primary + "30"}
        />
      </View>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your parking reservations will appear here
      </Text>
      <TouchableOpacity style={styles.bookNowButton}>
        <Text style={styles.bookNowText}>Book a Parking →</Text>
      </TouchableOpacity>
    </View>
  );

  // 🔥 LOADING UI
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={handleCancel} />
        )}
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
  listContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  headerStats: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    ...shadows.sm,
  },
  upcomingChip: {
    backgroundColor: colors.success + "10",
  },
  statChipText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  cardGradientHeader: {
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
  slotSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  slotText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textWhite,
  },
  cardContent: {
    padding: spacing.md,
  },
  parkingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  parkingIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  parkingTitleSection: {
    flex: 1,
  },
  parkingName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  datetimeContainer: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  datetimeItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  datetimeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  datetimeLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  datetimeValue: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  datetimeDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  totalLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencySymbol: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.primary,
  },
  totalPrice: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  cancelBookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger + "10",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  cancelBookingText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.danger,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success + "10",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  completedText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.success,
  },
  cancelledBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger + "10",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  cancelledText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  bookNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  bookNowText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textWhite,
  },
});
