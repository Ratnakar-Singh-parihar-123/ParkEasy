import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../styles/theme";

const ParkingCard = ({ parking, onPress }) => {
  const {
    name,
    address,
    distance,
    pricePerHour,
    availableSlots,
    totalSlots,
    isAvailable,
    rating,
    features = [],
  } = parking;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardContent}>
        {/* Left Icon with Gradient */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={
              isAvailable
                ? [colors.primary, colors.primaryDark]
                : [colors.danger, "#FF453A"]
            }
            style={styles.iconGradient}
          >
            <Ionicons name="car-outline" size={24} color="#FFF" />
          </LinearGradient>
        </View>

        {/* Middle Content */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.distanceTag}>
              <Ionicons
                name="navigate-outline"
                size={10}
                color={colors.primary}
              />
              <Text style={styles.distanceText}>{distance || "1.2 km"}</Text>
            </View>
            <View style={styles.ratingTag}>
              <Ionicons name="star" size={10} color={colors.warning} />
              <Text style={styles.ratingText}>{rating || "4.5"}</Text>
            </View>
            <View style={styles.slotsTag}>
              <Ionicons
                name="layers-outline"
                size={10}
                color={colors.success}
              />
              <Text style={styles.slotsText}>{availableSlots || 0} slots</Text>
            </View>
          </View>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
          <Text style={styles.price}>₹{pricePerHour}</Text>
          <Text style={styles.perHour}>/hour</Text>
        </View>
      </View>

      {/* Bottom Row */}
      <View
        style={[
          styles.bottomRow,
          { marginBottom: features.length > 0 ? spacing.sm : 0 },
        ]}
      >
        <View
          style={[
            styles.availabilityBadge,
            isAvailable ? styles.availableBadge : styles.fullBadge,
          ]}
        >
          {/* <Ionicons
            name={isAvailable ? "checkmark-circle" : "close-circle"}
            size={12}
            color={isAvailable ? colors.success : colors.danger}
          /> */}
          {/* <Text
            style={[
              styles.availabilityText,
              isAvailable ? styles.availableText : styles.fullText,
            ]}
          >
            {isAvailable
              ? `${availableSlots} spots available`
              : "Currently Full"}
          </Text> */}
        </View>

        <TouchableOpacity style={styles.bookHint}>
          <Text style={styles.bookHintText}>Details →</Text>
        </TouchableOpacity>
      </View>

      {/* Features Row */}
      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          {features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Ionicons
                name="checkmark-circle"
                size={10}
                color={colors.success}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  iconWrapper: {
    marginRight: spacing.md,
  },
  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  distanceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  distanceText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: "500",
  },
  ratingTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.warning + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    fontWeight: "500",
  },
  slotsTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  slotsText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: "500",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  perHour: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.lg,
    gap: 6,
  },
  availableBadge: {
    backgroundColor: colors.success + "10",
  },
  fullBadge: {
    backgroundColor: colors.danger + "10",
  },
  availabilityText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  availableText: {
    color: colors.success,
  },
  fullText: {
    color: colors.danger,
  },
  bookHint: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  bookHintText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.primary,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 6,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  featureText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});

export default ParkingCard;
