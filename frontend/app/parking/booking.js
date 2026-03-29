import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { parkingSpots } from '../../src/data/parkingData';
import { CustomButton } from '../../src/components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../src/styles/theme';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

export default function BookingScreen() {
  const router = useRouter();
  const { parkingId } = useLocalSearchParams();

  const parking = parkingSpots.find((p) => p.id === parkingId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const dates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      arr.push(date);
    }
    return arr;
  }, []);

  const availableEndTimes = useMemo(() => {
    if (!startTime) return [];
    const startIndex = timeSlots.indexOf(startTime);
    return timeSlots.slice(startIndex + 1);
  }, [startTime]);

  const duration = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    return endIndex - startIndex;
  }, [startTime, endTime]);

  const totalPrice = useMemo(() => {
    if (!parking || !duration) return 0;
    return parking.pricePerHour * duration;
  }, [parking, duration]);

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
    };
  };

  const isDateSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleStartTimeSelect = (time) => {
    setStartTime(time);
    setEndTime('');
  };

  const handleConfirmBooking = () => {
    if (!startTime || !endTime) {
      Alert.alert('Select Time', 'Please select start and end time for your booking.');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Confirm your booking at ${parking.name}\n\nDate: ${formatDate(selectedDate).full}\nTime: ${startTime} - ${endTime}\nDuration: ${duration} hour(s)\nTotal: $${totalPrice.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert(
              'Booking Confirmed!',
              'Your parking spot has been reserved. Check My Bookings for details.',
              [
                {
                  text: 'OK',
                  onPress: () => router.push('/(tabs)/bookings'),
                },
              ]
            );
          },
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Book Parking</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Parking Info */}
        <View style={styles.parkingInfo}>
          <View style={styles.parkingIcon}>
            <Ionicons name="car-sport" size={28} color={colors.primary} />
          </View>
          <View style={styles.parkingDetails}>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.address} numberOfLines={1}>
                {parking.address}
              </Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.price}>${parking.pricePerHour.toFixed(2)}</Text>
            <Text style={styles.perHour}>/hr</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dates.map((date, index) => {
              const formatted = formatDate(date);
              const isSelected = isDateSelected(date);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                    {formatted.day}
                  </Text>
                  <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                    {formatted.date}
                  </Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                    {formatted.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Start Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  startTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => handleStartTimeSelect(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    startTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* End Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>End Time</Text>
          {startTime ? (
            <View style={styles.timeGrid}>
              {availableEndTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    endTime === time && styles.timeSlotSelected,
                  ]}
                  onPress={() => setEndTime(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      endTime === time && styles.timeSlotTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyEndTime}>
              <Ionicons name="time-outline" size={24} color={colors.textLight} />
              <Text style={styles.emptyEndTimeText}>Select start time first</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        {duration > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate).full}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{startTime} - {endTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{duration} hour{duration > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rate</Text>
              <Text style={styles.summaryValue}>${parking.pricePerHour.toFixed(2)} / hour</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomBar}>
        {duration > 0 ? (
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomDuration}>{duration}h</Text>
            <Text style={styles.bottomPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
        ) : (
          <Text style={styles.bottomHint}>Select time slots</Text>
        )}
        <CustomButton
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          disabled={!startTime || !endTime}
          style={styles.confirmButton}
        />
      </View>
    </SafeAreaView>
  );
}

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
    paddingBottom: spacing.md,
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
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  parkingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  parkingIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkingDetails: {
    flex: 1,
    marginLeft: spacing.md,
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
  priceInfo: {
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
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  dateScrollContent: {
    paddingRight: spacing.md,
  },
  dateCard: {
    width: 70,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDay: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dateDaySelected: {
    color: colors.textWhite,
  },
  dateNumber: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  dateNumberSelected: {
    color: colors.textWhite,
  },
  dateMonth: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dateMonthSelected: {
    color: colors.textWhite,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    width: '23%',
    marginRight: '2%',
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timeSlotTextSelected: {
    color: colors.textWhite,
  },
  emptyEndTime: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.lg,
  },
  emptyEndTimeText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  summaryTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
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
  bottomDuration: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  bottomPrice: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  confirmButton: {
    minWidth: 160,
  },
});
