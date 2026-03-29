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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { allUsers as initialUsers, allBookings } from '../../src/data/parkingData';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserBookings = (userId) => {
    return allBookings.filter((b) => b.userId === userId);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    Alert.alert(
      'Update Status',
      `Mark ${user.name} as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setUsers(
              users.map((u) =>
                u.id === user.id ? { ...u, status: newStatus } : u
              )
            );
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => {
    const userBookings = getUserBookings(item.id);

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleViewUser(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.statusText, item.status === 'active' ? styles.statusTextActive : styles.statusTextInactive]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.statValue}>{item.totalBookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cash" size={16} color={colors.success} />
            <Text style={styles.statValue}>${item.totalSpent}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="car" size={16} color={colors.warning} />
            <Text style={styles.statValue}>{item.vehicleNumber || 'N/A'}</Text>
            <Text style={styles.statLabel}>Vehicle</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.memberSince}>Member since {item.memberSince}</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleViewUser(item)}
            >
              <Ionicons name="eye-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleToggleStatus(item)}
            >
              <Ionicons
                name={item.status === 'active' ? 'pause-circle-outline' : 'play-circle-outline'}
                size={18}
                color={item.status === 'active' ? colors.warning : colors.success}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Calculate totals
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const totalSpent = users.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Admin Panel</Text>
          <Text style={styles.title}>Manage Users</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.overviewStats}>
        <View style={styles.overviewStatItem}>
          <Text style={styles.overviewStatValue}>{users.length}</Text>
          <Text style={styles.overviewStatLabel}>Total Users</Text>
        </View>
        <View style={styles.overviewStatDivider} />
        <View style={styles.overviewStatItem}>
          <Text style={[styles.overviewStatValue, { color: colors.success }]}>{activeUsers}</Text>
          <Text style={styles.overviewStatLabel}>Active</Text>
        </View>
        <View style={styles.overviewStatDivider} />
        <View style={styles.overviewStatItem}>
          <Text style={[styles.overviewStatValue, { color: colors.primary }]}>${totalSpent}</Text>
          <Text style={styles.overviewStatLabel}>Total Spent</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
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

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      {/* User Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>User Details</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalUserInfo}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selectedUser.name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <Text style={styles.modalUserName}>{selectedUser.name}</Text>
                  <Text style={styles.modalUserEmail}>{selectedUser.email}</Text>
                  <View style={[styles.statusBadge, selectedUser.status === 'active' ? styles.statusActive : styles.statusInactive, { marginTop: spacing.sm }]}>
                    <Text style={[styles.statusText, selectedUser.status === 'active' ? styles.statusTextActive : styles.statusTextInactive]}>
                      {selectedUser.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailItem}>
                    <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedUser.phone}</Text>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Ionicons name="car-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedUser.vehicleNumber || 'Not provided'}</Text>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.modalDetailText}>Member since {selectedUser.memberSince}</Text>
                  </View>
                </View>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatValue}>{selectedUser.totalBookings}</Text>
                    <Text style={styles.modalStatLabel}>Total Bookings</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatValue}>${selectedUser.totalSpent}</Text>
                    <Text style={styles.modalStatLabel}>Total Spent</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.modalButton, selectedUser.status === 'active' ? styles.modalButtonWarning : styles.modalButtonSuccess]}
                  onPress={() => {
                    setModalVisible(false);
                    handleToggleStatus(selectedUser);
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
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
  overviewStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  overviewStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  overviewStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  overviewStatDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
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
  listContent: {
    padding: spacing.md,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textWhite,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusActive: {
    backgroundColor: colors.success + '15',
  },
  statusInactive: {
    backgroundColor: colors.danger + '15',
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextInactive: {
    color: colors.danger,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  memberSince: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
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
  modalUserInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  modalAvatarText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textWhite,
  },
  modalUserName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalUserEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  modalDetails: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalDetailText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  modalStats: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  modalStatItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  modalStatValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  modalStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalButtonWarning: {
    backgroundColor: colors.warning,
  },
  modalButtonSuccess: {
    backgroundColor: colors.success,
  },
  modalButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textWhite,
  },
});
