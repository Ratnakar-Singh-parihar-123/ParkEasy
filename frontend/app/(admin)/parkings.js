import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { parkingSpots as initialParkingSpots } from '../../src/data/parkingData';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

export default function AdminParkings() {
  const [parkings, setParkings] = useState(initialParkingSpots);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pricePerHour: '',
    totalSlots: '',
    availableSlots: '',
  });

  const filteredParkings = parkings.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingParking(null);
    setFormData({
      name: '',
      address: '',
      pricePerHour: '',
      totalSlots: '',
      availableSlots: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (parking) => {
    setEditingParking(parking);
    setFormData({
      name: parking.name,
      address: parking.address,
      pricePerHour: parking.pricePerHour.toString(),
      totalSlots: parking.totalSlots.toString(),
      availableSlots: parking.availableSlots.toString(),
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.pricePerHour) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (editingParking) {
      // Update existing
      setParkings(
        parkings.map((p) =>
          p.id === editingParking.id
            ? {
                ...p,
                name: formData.name,
                address: formData.address,
                pricePerHour: parseFloat(formData.pricePerHour),
                totalSlots: parseInt(formData.totalSlots) || 0,
                availableSlots: parseInt(formData.availableSlots) || 0,
                isAvailable: parseInt(formData.availableSlots) > 0,
              }
            : p
        )
      );
      Alert.alert('Success', 'Parking updated successfully');
    } else {
      // Add new
      const newParking = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        distance: '0.0 km',
        pricePerHour: parseFloat(formData.pricePerHour),
        totalSlots: parseInt(formData.totalSlots) || 50,
        availableSlots: parseInt(formData.availableSlots) || 50,
        isAvailable: true,
        rating: 4.0,
        features: ['New'],
        openTime: '06:00',
        closeTime: '22:00',
        coordinates: { lat: 0, lng: 0 },
      };
      setParkings([newParking, ...parkings]);
      Alert.alert('Success', 'Parking added successfully');
    }
    setModalVisible(false);
  };

  const handleDelete = (parking) => {
    Alert.alert(
      'Delete Parking',
      `Are you sure you want to delete "${parking.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setParkings(parkings.filter((p) => p.id !== parking.id));
            Alert.alert('Deleted', 'Parking removed successfully');
          },
        },
      ]
    );
  };

  const toggleAvailability = (parking) => {
    setParkings(
      parkings.map((p) =>
        p.id === parking.id
          ? {
              ...p,
              isAvailable: !p.isAvailable,
              availableSlots: p.isAvailable ? 0 : p.totalSlots,
            }
          : p
      )
    );
  };

  const renderParkingItem = ({ item }) => (
    <View style={styles.parkingCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusIndicator, item.isAvailable ? styles.statusAvailable : styles.statusFull]} />
        <View style={styles.cardInfo}>
          <Text style={styles.parkingName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.price}>${item.pricePerHour.toFixed(2)}</Text>
          <Text style={styles.perHour}>/hr</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalSlots}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{item.availableSlots}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.statValue}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, item.isAvailable ? styles.closeButton : styles.openButton]}
          onPress={() => toggleAvailability(item)}
        >
          <Ionicons name={item.isAvailable ? 'close-circle' : 'checkmark-circle'} size={16} color={item.isAvailable ? colors.warning : colors.success} />
          <Text style={[styles.actionText, { color: item.isAvailable ? colors.warning : colors.success }]}>
            {item.isAvailable ? 'Mark Full' : 'Open'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={16} color={colors.danger} />
          <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Admin Panel</Text>
          <Text style={styles.title}>Manage Parkings</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search parkings..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {parkings.length} total • {parkings.filter(p => p.isAvailable).length} available
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredParkings}
        keyExtractor={(item) => item.id}
        renderItem={renderParkingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingParking ? 'Edit Parking' : 'Add New Parking'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Parking Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter parking name"
                  placeholderTextColor={colors.textLight}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter full address"
                  placeholderTextColor={colors.textLight}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: spacing.sm }]}>
                  <Text style={styles.label}>Price/Hour *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={colors.textLight}
                    keyboardType="decimal-pad"
                    value={formData.pricePerHour}
                    onChangeText={(text) => setFormData({ ...formData, pricePerHour: text })}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Total Slots</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    placeholderTextColor={colors.textLight}
                    keyboardType="number-pad"
                    value={formData.totalSlots}
                    onChangeText={(text) => setFormData({ ...formData, totalSlots: text })}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Available Slots</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter available slots"
                  placeholderTextColor={colors.textLight}
                  keyboardType="number-pad"
                  value={formData.availableSlots}
                  onChangeText={(text) => setFormData({ ...formData, availableSlots: text })}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {editingParking ? 'Update Parking' : 'Add Parking'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  statsBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  parkingCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  statusAvailable: {
    backgroundColor: colors.success,
  },
  statusFull: {
    backgroundColor: colors.danger,
  },
  cardInfo: {
    flex: 1,
  },
  parkingName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  perHour: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
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
  editButton: {
    backgroundColor: colors.primary + '10',
  },
  closeButton: {
    backgroundColor: colors.warning + '10',
  },
  openButton: {
    backgroundColor: colors.success + '10',
  },
  deleteButton: {
    backgroundColor: colors.danger + '10',
    marginRight: 0,
  },
  actionText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  saveButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textWhite,
  },
});
