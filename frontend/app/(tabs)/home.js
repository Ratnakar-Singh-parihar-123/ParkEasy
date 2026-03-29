import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { parkingSpots } from '../../src/data/parkingData';
import { ParkingCard } from '../../src/components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpots = parkingSpots.filter((spot) =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleParkingPress = (parking) => {
    router.push({
      pathname: '/parking/details',
      params: { parkingId: parking.id },
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.appName}>ParkEasy</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search parking location..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapGrid}>
            {[...Array(20)].map((_, i) => (
              <View key={i} style={styles.mapGridItem} />
            ))}
          </View>
          <View style={styles.mapOverlay}>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={32} color={colors.primary} />
            </View>
            <View style={styles.mapCurrentLocation}>
              <View style={styles.currentLocationDot} />
              <View style={styles.currentLocationRing} />
            </View>
          </View>
          <View style={styles.mapLabel}>
            <Ionicons name="map" size={14} color={colors.textSecondary} />
            <Text style={styles.mapLabelText}>Map View</Text>
          </View>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Parking</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={18} color={colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={48} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No parking spots found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParkingCard
            parking={item}
            onPress={() => handleParkingPress(item)}
          />
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
  listContent: {
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    paddingTop: spacing.md,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
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
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    height: 52,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  mapContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  mapPlaceholder: {
    height: 180,
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
    position: 'absolute',
    top: '35%',
    left: '55%',
  },
  mapCurrentLocation: {
    position: 'absolute',
    bottom: '30%',
    left: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  currentLocationRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '30',
  },
  mapLabel: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface + 'E6',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  mapLabelText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.sm,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
