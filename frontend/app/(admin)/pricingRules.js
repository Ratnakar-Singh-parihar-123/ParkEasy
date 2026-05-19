import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const PricingRulesScreen = () => {
  const [dynamicPricing, setDynamicPricing] = useState(true);
  const [nightPricing, setNightPricing] = useState(false);
  const [weekendPricing, setWeekendPricing] = useState(true);
  const [vipEnabled, setVipEnabled] = useState(true);

  const pricingRules = [
    {
      id: 1,
      title: "Bike Parking",
      price: "₹20 / hour",
      icon: "bicycle",
      color: "#0ea5e9",
      desc: "Affordable parking for two-wheelers.",
      slots: "120 Slots",
    },
    {
      id: 2,
      title: "Car Parking",
      price: "₹50 / hour",
      icon: "car-sport",
      color: "#2563eb",
      desc: "Secure parking for standard vehicles.",
      slots: "240 Slots",
    },
    {
      id: 3,
      title: "EV Charging Parking",
      price: "₹90 / hour",
      icon: "flash",
      color: "#16a34a",
      desc: "Includes charging support for EV cars.",
      slots: "45 Slots",
    },
    {
      id: 4,
      title: "VIP Reserved",
      price: "₹150 / hour",
      icon: "diamond",
      color: "#f59e0b",
      desc: "Premium slots near main entrance.",
      slots: "20 Slots",
    },
    {
      id: 5,
      title: "Monthly Membership",
      price: "₹4200 / month",
      icon: "card",
      color: "#9333ea",
      desc: "Unlimited monthly parking access.",
      slots: "80 Members",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.iconWrapper}>
              <Ionicons name="cash-outline" size={40} color="#fff" />
            </View>

            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Pricing Management</Text>

          <Text style={styles.headerSub}>
            Manage parking charges, memberships & premium pricing rules
          </Text>

          {/* DASHBOARD CARDS */}
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsNumber}>₹24.5K</Text>
              <Text style={styles.analyticsLabel}>Today Revenue</Text>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsNumber}>582</Text>
              <Text style={styles.analyticsLabel}>Total Bookings</Text>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsNumber}>91%</Text>
              <Text style={styles.analyticsLabel}>Occupancy</Text>
            </View>
          </View>
        </View>

        {/* PRICING RULES */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Pricing Plans</Text>

            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {pricingRules.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              style={styles.ruleCard}
            >
              <View
                style={[
                  styles.ruleIcon,
                  {
                    backgroundColor: `${item.color}18`,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.cardTop}>
                  <Text style={styles.ruleTitle}>{item.title}</Text>

                  <View
                    style={[
                      styles.priceBadge,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  >
                    <Text style={styles.priceBadgeText}>{item.price}</Text>
                  </View>
                </View>

                <Text style={styles.ruleDesc}>{item.desc}</Text>

                <View style={styles.bottomRow}>
                  <View style={styles.slotBox}>
                    <Ionicons name="car-outline" size={14} color="#64748b" />
                    <Text style={styles.slotText}>{item.slots}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.editBtn}>
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#2563eb"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn}>
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Settings</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIcon, { backgroundColor: "#dbeafe" }]}
              >
                <Ionicons name="trending-up" size={20} color="#2563eb" />
              </View>

              <View>
                <Text style={styles.settingTitle}>Dynamic Pricing</Text>

                <Text style={styles.settingDesc}>
                  Auto increase prices during rush hours
                </Text>
              </View>
            </View>

            <Switch
              value={dynamicPricing}
              onValueChange={setDynamicPricing}
              trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
              thumbColor={dynamicPricing ? "#2563eb" : "#fff"}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIcon, { backgroundColor: "#fef3c7" }]}
              >
                <Ionicons name="moon" size={20} color="#f59e0b" />
              </View>

              <View>
                <Text style={styles.settingTitle}>Night Charges</Text>

                <Text style={styles.settingDesc}>
                  Additional pricing after 10 PM
                </Text>
              </View>
            </View>

            <Switch
              value={nightPricing}
              onValueChange={setNightPricing}
              trackColor={{ false: "#d1d5db", true: "#fde68a" }}
              thumbColor={nightPricing ? "#f59e0b" : "#fff"}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIcon, { backgroundColor: "#dcfce7" }]}
              >
                <MaterialIcons name="weekend" size={20} color="#16a34a" />
              </View>

              <View>
                <Text style={styles.settingTitle}>Weekend Pricing</Text>

                <Text style={styles.settingDesc}>
                  Higher pricing on weekends & holidays
                </Text>
              </View>
            </View>

            <Switch
              value={weekendPricing}
              onValueChange={setWeekendPricing}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={weekendPricing ? "#16a34a" : "#fff"}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <View
                style={[styles.settingIcon, { backgroundColor: "#ede9fe" }]}
              >
                <Ionicons name="diamond" size={20} color="#7c3aed" />
              </View>

              <View>
                <Text style={styles.settingTitle}>VIP Membership</Text>

                <Text style={styles.settingDesc}>
                  Enable premium reserved parking
                </Text>
              </View>
            </View>

            <Switch
              value={vipEnabled}
              onValueChange={setVipEnabled}
              trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
              thumbColor={vipEnabled ? "#7c3aed" : "#fff"}
            />
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity activeOpacity={0.88} style={styles.saveBtn}>
          <Ionicons name="save-outline" size={22} color="#fff" />

          <Text style={styles.saveText}>Save Pricing Configuration</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PricingRulesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    backgroundColor: "#1d4ed8",
    paddingTop: 60,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconWrapper: {
    width: 85,
    height: 85,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    marginTop: 22,
  },

  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 8,
    lineHeight: 22,
  },

  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },

  analyticsCard: {
    width: "31%",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
  },

  analyticsNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  analyticsLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },

  section: {
    paddingHorizontal: 18,
    marginTop: 26,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  ruleCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    elevation: 4,
  },

  ruleIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ruleTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
  },

  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  priceBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  ruleDesc: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 8,
    lineHeight: 20,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  slotBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  slotText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
  },

  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },

  settingCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  settingIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  settingDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    width: 220,
    lineHeight: 18,
  },

  saveBtn: {
    backgroundColor: "#2563eb",
    marginHorizontal: 18,
    marginTop: 30,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },
});
