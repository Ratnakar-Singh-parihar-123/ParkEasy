import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../../src/styles/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { CustomButton } from "../../src/components";

// ✅ API import
import { getParkingById } from "../../src/api/userParkingApi";

const { width } = Dimensions.get("window");

export default function ParkingDetailsScreen() {
  const router = useRouter();
  const { parkingId } = useLocalSearchParams();

  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParking();
  }, []);

  const fetchParking = async () => {
    try {
      const res = await getParkingById(parkingId);
      const p = res.data;

      console.log("📦 Parking Data:", p); // DEBUG

      const formatted = {
        id: p._id,
        name: p.name,
        address: p.address,
        pricePerHour: Number(p.pricePerHour || 0), // ✅ FIX
        availableSlots: p.availableSlots || 0,
        totalSlots: p.totalSlots || 0,
        isAvailable: p.availableSlots > 0,
        rating: 4.5,
        distance: "1.2 km",
        openTime: "06:00",
        closeTime: "23:00",
        features: ["CCTV", "Security", "Covered", "24/7 Support"],
      };

      setParking(formatted);
    } catch (error) {
      console.log(
        "❌ Parking fetch error:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    router.push({
      pathname: "/parking/booking",
      params: { parkingId: parking.id },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading parking details...</Text>
      </SafeAreaView>
    );
  }

  if (!parking) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
        <Text style={styles.errorText}>Parking not found</Text>
        <CustomButton title="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const occupancyPercentage =
    (parking.availableSlots / parking.totalSlots) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient Overlay */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="share-outline"
                size={22}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Parking Image Placeholder */}
          <View style={styles.imagePlaceholder}>
            <Ionicons name="car-outline" size={80} color={colors.primary} />
          </View>
        </View>

        {/* Main Content Card */}
        <View style={styles.contentCard}>
          {/* Title & Rating */}
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.parkingName}>{parking.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.address}>{parking.address}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFB800" />
              <Text style={styles.ratingText}>{parking.rating}</Text>
            </View>
          </View>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Price</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.price}>{parking.pricePerHour}</Text>
              <Text style={styles.perHour}>/hour</Text>
            </View>
          </View>

          {/* Availability Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityHeader}>
                <View style={styles.availabilityLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      parking.isAvailable
                        ? styles.availableDot
                        : styles.fullDot,
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {parking.isAvailable ? "Available Now" : "Currently Full"}
                  </Text>
                </View>
                <Text style={styles.slotCount}>
                  {parking.availableSlots} / {parking.totalSlots} slots
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${occupancyPercentage}%`,
                      backgroundColor: parking.isAvailable
                        ? colors.success
                        : colors.danger,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Quick Info Row */}
          <View style={styles.quickInfoRow}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={styles.quickInfoLabel}>Open Hours</Text>
              <Text style={styles.quickInfoValue}>
                {parking.openTime} - {parking.closeTime}
              </Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <Ionicons
                name="navigate-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.quickInfoLabel}>Distance</Text>
              <Text style={styles.quickInfoValue}>{parking.distance}</Text>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities & Features</Text>
            <View style={styles.featuresGrid}>
              {parking.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons
                      name={getFeatureIcon(feature)}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.notesSection}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.notesText}>
              Free cancellation up to 1 hour before booking time
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <View style={styles.bottomPriceContainer}>
            <Text style={styles.bottomCurrency}>₹</Text>
            <Text style={styles.bottomPrice}>{parking.pricePerHour}</Text>
            <Text style={styles.bottomPerHour}>/hour</Text>
          </View>
        </View>
        <CustomButton
          title="Book Now"
          onPress={handleBookNow}
          disabled={!parking.isAvailable}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const getFeatureIcon = (feature) => {
  const iconMap = {
    CCTV: "videocam-outline",
    Security: "shield-checkmark-outline",
    Covered: "umbrella-outline",
    "24/7 Support": "headset-outline",
    "EV Charging": "flash-outline",
    Underground: "layers-outline",
    "Valet Available": "key-outline",
    "Handicap Access": "accessibility-outline",
    "Shuttle Service": "bus-outline",
    "Long Term Rates": "calendar-outline",
    "Smart Parking": "phone-portrait-outline",
    "Monthly Plans": "card-outline",
    "Open Air": "sunny-outline",
    "Scenic View": "eye-outline",
    "Budget Friendly": "cash-outline",
    "Near Transit": "train-outline",
    "Quick Access": "speedometer-outline",
  };
  return iconMap[feature] || "checkmark-circle-outline";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginVertical: spacing.md,
    fontWeight: "500",
  },
  headerContainer: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  imagePlaceholder: {
    height: 200,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  contentCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: -spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  parkingName: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  ratingText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  priceCard: {
    backgroundColor: colors.primary + "08",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 2,
  },
  price: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.primary,
  },
  perHour: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  availabilityCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  availabilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  availabilityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  availableDot: {
    backgroundColor: colors.success,
  },
  fullDot: {
    backgroundColor: colors.danger,
  },
  statusText: {
    fontSize: fontSize.md,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  slotCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  quickInfoRow: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  quickInfoItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  quickInfoDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  quickInfoLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickInfoValue: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  notesSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.info + "10",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  notesText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  totalPriceLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  bottomPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bottomCurrency: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.primary,
  },
  bottomPrice: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.primary,
  },
  bottomPerHour: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  bookButton: {
    minWidth: 140,
  },
});
