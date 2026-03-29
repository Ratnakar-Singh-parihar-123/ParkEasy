import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { parkingSpots } from '../../src/data/parkingData';
import { CustomButton } from '../../src/components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

export default function ParkingDetailsScreen() {
  const router = useRouter();
  const { parkingId } = useLocalSearchParams();

  const parking = parkingSpots.find((p) => p.id === parkingId);

  if (!parking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.danger} />
          <Text style={styles.errorText}>Parking spot not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleBookNow = () => {
    router.push({
      pathname: '/parking/booking',
      params: { parkingId: parking.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Map/Image Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapGrid}>
              {[...Array(25)].map((_, i) => (
                <View key={i} style={styles.mapGridItem} />
              ))}
            </View>
            <View style={styles.mapOverlay}>
              <View style={styles.mapPin}>
                <Ionicons name="location" size={48} color={colors.primary} />
              </View>
            </View>
            <View style={styles.mapLabel}>
              <Ionicons name="expand" size={16} color={colors.textWhite} />
              <Text style={styles.mapLabelText}>View Full Map</Text>
            </View>
          </View>
        </View>

        {/* Parking Info */}
        <View style={styles.infoCard}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.parkingName}>{parking.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={styles.rating}>{parking.rating}</Text>
                <Text style={styles.reviews}>(128 reviews)</Text>
              </View>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.price}>${parking.pricePerHour.toFixed(2)}</Text>
              <Text style={styles.perHour}>/hour</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.address}>{parking.address}</Text>
          </View>

          {/* Distance & Hours */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="navigate" size={18} color={colors.primary} />
              </View>
              <Text style={styles.detailText}>{parking.distance}</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.detailText}>{parking.openTime} - {parking.closeTime}</Text>
            </View>
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityMain}>
              <View style={[styles.availabilityIndicator, parking.isAvailable ? styles.indicatorAvailable : styles.indicatorFull]} />
              <View style={styles.availabilityInfo}>
                <Text style={styles.availabilityStatus}>
                  {parking.isAvailable ? 'Spots Available' : 'Currently Full'}
                </Text>
                <Text style={styles.availabilityCount}>
                  {parking.availableSlots} of {parking.totalSlots} spots free
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((parking.totalSlots - parking.availableSlots) / parking.totalSlots) * 100}%`,
                    backgroundColor: parking.isAvailable ? colors.success : colors.danger,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features & Amenities</Text>
          <View style={styles.featuresGrid}>
            {parking.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
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

        {/* Info Cards */}
        <View style={styles.infoCardsRow}>
          <View style={styles.miniCard}>
            <Ionicons name="shield-checkmark" size={24} color={colors.success} />
            <Text style={styles.miniCardTitle}>Secure</Text>
            <Text style={styles.miniCardSubtitle}>24/7 CCTV</Text>
          </View>
          <View style={styles.miniCard}>
            <Ionicons name="flash" size={24} color={colors.warning} />
            <Text style={styles.miniCardTitle}>Quick</Text>
            <Text style={styles.miniCardSubtitle}>Easy Access</Text>
          </View>
          <View style={styles.miniCard}>
            <Ionicons name="wallet" size={24} color={colors.primary} />
            <Text style={styles.miniCardTitle}>Pay</Text>
            <Text style={styles.miniCardSubtitle}>All Methods</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomPrice}>${parking.pricePerHour.toFixed(2)}</Text>
          <Text style={styles.bottomPerHour}>per hour</Text>
        </View>
        <CustomButton
          title="Book Now"
          onPress={handleBookNow}
          disabled={!parking.isAvailable}
          icon="arrow-forward"
          iconPosition="right"
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const getFeatureIcon = (feature) => {
  const iconMap = {
    'Covered': 'umbrella-outline',
    '24/7 Security': 'shield-checkmark-outline',
    'EV Charging': 'flash-outline',
    'Underground': 'layers-outline',
    'Valet Available': 'key-outline',
    'Handicap Access': 'accessibility-outline',
    'Shuttle Service': 'bus-outline',
    'Long Term Rates': 'calendar-outline',
    'Smart Parking': 'phone-portrait-outline',
    'Monthly Plans': 'card-outline',
    'Open Air': 'sunny-outline',
    'Scenic View': 'eye-outline',
    'Budget Friendly': 'cash-outline',
    'Near Transit': 'train-outline',
    'Quick Access': 'speedometer-outline',
  };
  return iconMap[feature] || 'checkmark-circle-outline';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  mapContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.mapBackground,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  mapGridItem: {
    width: '20%',
    height: '20%',
    borderWidth: 0.5,
    borderColor: colors.primaryLight + '30',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    marginTop: -20,
  },
  mapLabel: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  mapLabelText: {
    fontSize: fontSize.sm,
    color: colors.textWhite,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  parkingName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  rating: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  reviews: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  perHour: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  availabilityCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  availabilityMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  indicatorAvailable: {
    backgroundColor: colors.success,
  },
  indicatorFull: {
    backgroundColor: colors.danger,
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityStatus: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  availabilityCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  infoCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  miniCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  miniCardTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  miniCardSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomPrice: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomPerHour: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  bookButton: {
    minWidth: 160,
  },
});
