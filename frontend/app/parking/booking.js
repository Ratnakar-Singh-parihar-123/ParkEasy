import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";
import { CustomButton } from "../../src/components";

// ✅ APIs
import { createBooking, getParkingById } from "../../src/api/userParkingApi";

import {
  colors,
  spacing,
  fontSize,
  borderRadius,
  shadows,
} from "../../src/styles/theme";

const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export default function BookingScreen() {
  const router = useRouter();
  const { parkingId } = useLocalSearchParams();

  const [parking, setParking] = useState(null);
  const [loadingParking, setLoadingParking] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FETCH PARKING FROM BACKEND
  useEffect(() => {
    fetchParking();
  }, []);

  const fetchParking = async () => {
    try {
      const res = await getParkingById(parkingId);

      setParking(res.data); // direct backend object
    } catch (error) {
      console.log(
        "❌ Parking Fetch Error:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoadingParking(false);
    }
  };

  // ✅ END TIME
  const availableEndTimes = useMemo(() => {
    if (!startTime) return [];
    const index = timeSlots.indexOf(startTime);
    return timeSlots.slice(index + 1);
  }, [startTime]);

  // ✅ DURATION
  const duration = useMemo(() => {
    if (!startTime || !endTime) return 0;
    return timeSlots.indexOf(endTime) - timeSlots.indexOf(startTime);
  }, [startTime, endTime]);

  // ✅ PRICE FIXED
  const totalPrice = useMemo(() => {
    if (!parking || !duration) return 0;
    return parking.pricePerHour * duration;
  }, [parking, duration]);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // ✅ BOOKING
  const handleConfirmBooking = () => {
    if (!startTime || !endTime) {
      Alert.alert("Error", "Select start & end time");
      return;
    }

    Alert.alert("Confirm Booking", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            setLoading(true);

            const payload = {
              parkingId: parking._id, // ✅ FIXED
              date: formatDate(selectedDate),
              startTime,
              endTime,
            };

            console.log("📦 Payload:", payload);

            await createBooking(payload);

            Alert.alert("Success", "Booking created");

            router.push("/(tabs)/bookings");
          } catch (error) {
            console.log(
              "❌ Booking Error:",
              error?.response?.data || error.message,
            );

            Alert.alert(
              "Error",
              error?.response?.data?.message || "Booking failed",
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // 🔄 LOADING PARKING
  if (loadingParking) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // ❌ NOT FOUND
  if (!parking) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <Text>Parking not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{parking.name}</Text>

        <Text>{parking.address}</Text>

        {/* START TIME */}
        <Text style={{ marginTop: 20 }}>Start Time</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => {
                setStartTime(time);
                setEndTime("");
              }}
              style={{
                padding: 8,
                margin: 4,
                backgroundColor: startTime === time ? colors.primary : "#eee",
              }}
            >
              <Text>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* END TIME */}
        <Text style={{ marginTop: 20 }}>End Time</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {availableEndTimes.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setEndTime(time)}
              style={{
                padding: 8,
                margin: 4,
                backgroundColor: endTime === time ? colors.primary : "#eee",
              }}
            >
              <Text>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SUMMARY */}
        {duration > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text>Date: {formatDate(selectedDate)}</Text>
            <Text>Duration: {duration} hr</Text>
            <Text>Total: ₹{totalPrice}</Text>
          </View>
        )}

        <CustomButton
          title={loading ? "Booking..." : "Confirm Booking"}
          onPress={handleConfirmBooking}
          disabled={!startTime || !endTime || loading}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 10 }}
          />
        )}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textWhite,
  },
  tabBadge: {
    backgroundColor: colors.textWhite + "30",
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textWhite,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  parkingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cardHeaderContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  parkingName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  totalLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger + "10",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  cancelButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
});
