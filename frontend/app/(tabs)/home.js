import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ParkingCard } from "../../src/components";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../../src/styles/theme";

// ✅ API
import { getAllParkings } from "../../src/api/userParkingApi";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // 🔥 FETCH PARKINGS
  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const res = await getAllParkings();
      const formatted = res.data.parkings.map((p) => ({
        ...p,
        id: p._id,
        pricePerHour: Number(p.pricePerHour || 0),
        availableSlots: p.availableSlots || 0,
      }));
      setParkings(formatted);
    } catch (error) {
      console.log("Error fetching parkings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH FILTER
  const filteredSpots = parkings.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "available" && spot.availableSlots > 0) ||
      (selectedFilter === "cheapest" && spot.pricePerHour <= 50);
    return matchesSearch && matchesFilter;
  });

  const handleParkingPress = (parking) => {
    router.push({
      pathname: "/parking/details",
      params: { parkingId: parking.id },
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.appHeader}>
            <View>
              <Text style={styles.greeting}>Welcome, Back! 👋</Text>
              <Text style={styles.appName}>ParkEasy</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={22} color="#FFF" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search parking..."
                placeholderTextColor={colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Ionicons name="car-outline" size={22} color={colors.primary} />
          <Text style={styles.statNumber}>{parkings.length}</Text>
          <Text style={styles.statLabel}>Total Parkings</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={colors.success}
          />
          <Text style={styles.statNumber}>
            {parkings.filter((p) => p.availableSlots > 0).length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons
            name="trending-up-outline"
            size={22}
            color={colors.warning}
          />
          <Text style={styles.statNumber}>
            {parkings.reduce((sum, p) => sum + (p.availableSlots || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Free Slots</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsContainer}
      >
        <TouchableOpacity style={styles.quickActionBtn}>
          <LinearGradient
            colors={[colors.primary + "20", colors.primary + "05"]}
            style={styles.quickActionGradient}
          >
            <Ionicons
              name="location-outline"
              size={22}
              color={colors.primary}
            />
          </LinearGradient>
          <Text style={styles.quickActionText}>Nearby</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <LinearGradient
            colors={[colors.success + "20", colors.success + "05"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="star-outline" size={22} color={colors.success} />
          </LinearGradient>
          <Text style={styles.quickActionText}>Top Rated</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn}>
          <LinearGradient
            colors={[colors.warning + "20", colors.warning + "05"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="time-outline" size={22} color={colors.warning} />
          </LinearGradient>
          <Text style={styles.quickActionText}>24/7 Open</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={() => setShowFilterModal(true)}
        >
          <LinearGradient
            colors={[colors.info + "20", colors.info + "05"]}
            style={styles.quickActionGradient}
          >
            <Ionicons name="options-outline" size={22} color={colors.info} />
          </LinearGradient>
          <Text style={styles.quickActionText}>Filter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Nearby Parking</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredSpots.length} spots found
          </Text>
        </View>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort by</Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons
          name="search-outline"
          size={48}
          color={colors.primary + "40"}
        />
      </View>
      <Text style={styles.emptyTitle}>No parking spots found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try a different search term"
          : "Check back later for new spots"}
      </Text>
    </View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Parking</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Availability</Text>
            <View style={styles.filterOptions}>
              {[
                { id: "all", label: "All Spots", icon: "apps-outline" },
                {
                  id: "available",
                  label: "Available Now",
                  icon: "checkmark-circle-outline",
                },
                {
                  id: "cheapest",
                  label: "Cheapest First",
                  icon: "cash-outline",
                },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.id && styles.filterChipActive,
                  ]}
                  onPress={() => {
                    setSelectedFilter(filter.id);
                    setShowFilterModal(false);
                  }}
                >
                  <Ionicons
                    name={filter.icon}
                    size={16}
                    color={
                      selectedFilter === filter.id
                        ? "#FFF"
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === filter.id &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearFilterBtn}
            onPress={() => {
              setSelectedFilter("all");
              setShowFilterModal(false);
            }}
          >
            <Text style={styles.clearFilterText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // 🔥 LOADING UI
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding best parking spots...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item._id}
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
      <FilterModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xxl,
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
  headerContainer: {
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize.md,
    color: colors.textWhite + "CC",
    marginBottom: 2,
  },
  appName: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.textWhite,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.textWhite + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 50,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  quickStats: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.md,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  quickActionBtn: {
    alignItems: "center",
    marginRight: spacing.md,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterSectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.textWhite,
  },
  clearFilterBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  clearFilterText: {
    fontSize: fontSize.md,
    color: colors.danger,
    fontWeight: "500",
  },
});
