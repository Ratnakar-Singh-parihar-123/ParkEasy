import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../styles/theme';

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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        {/* Left Icon */}
        <View style={[styles.iconContainer, !isAvailable && styles.iconContainerFull]}>
          <Ionicons
            name="car-sport"
            size={28}
            color={isAvailable ? colors.primary : colors.danger}
          />
        </View>

        {/* Middle Content */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.distanceTag}>
              <Ionicons name="navigate" size={12} color={colors.primary} />
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
            <View style={styles.ratingTag}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
          <Text style={styles.price}>${pricePerHour.toFixed(2)}</Text>
          <Text style={styles.perHour}>per hour</Text>
          <View
            style={[
              styles.availabilityBadge,
              isAvailable ? styles.availableBadge : styles.fullBadge,
            ]}
          >
            <Text
              style={[
                styles.availabilityText,
                isAvailable ? styles.availableText : styles.fullText,
              ]}
            >
              {isAvailable ? `${availableSlots} spots` : 'Full'}
            </Text>
          </View>
        </View>
      </View>

      {/* Features Row */}
      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          {features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
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
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerFull: {
    backgroundColor: colors.danger + '15',
  },
  infoContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  distanceText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  perHour: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  availabilityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  availableBadge: {
    backgroundColor: colors.success + '15',
  },
  fullBadge: {
    backgroundColor: colors.danger + '15',
  },
  availabilityText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  availableText: {
    color: colors.success,
  },
  fullText: {
    color: colors.danger,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  featureTag: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});

export default ParkingCard;
