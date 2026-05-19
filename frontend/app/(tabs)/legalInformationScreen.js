import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const LegalInformationScreen = () => {
  const legalData = [
    {
      id: 1,
      title: "Terms & Conditions",
      icon: "document-text",
      color: "#2563eb",
      desc: "Read our platform usage rules and service policies.",
    },
    {
      id: 2,
      title: "Privacy Policy",
      icon: "shield-checkmark",
      color: "#16a34a",
      desc: "Learn how we collect and protect your personal data.",
    },
    {
      id: 3,
      title: "Refund Policy",
      icon: "cash",
      color: "#f59e0b",
      desc: "Understand refund eligibility and cancellation process.",
    },
    {
      id: 4,
      title: "Parking Rules",
      icon: "car-sport",
      color: "#9333ea",
      desc: "Guidelines for safe and proper parking usage.",
    },
    {
      id: 5,
      title: "User Agreement",
      icon: "people",
      color: "#ef4444",
      desc: "Agreement between users and parking management.",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="shield-checkmark" size={42} color="#fff" />
          </View>

          <Text style={styles.headerTitle}>Legal Information</Text>

          <Text style={styles.headerSub}>
            Terms, privacy policies and parking regulations
          </Text>
        </View>

        {/* QUICK INFO */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoNumber}>100%</Text>
            <Text style={styles.infoLabel}>Secure Data</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoNumber}>24/7</Text>
            <Text style={styles.infoLabel}>User Support</Text>
          </View>
        </View>

        {/* LEGAL LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Documents</Text>

          {legalData.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={styles.card}
            >
              <View
                style={[
                  styles.cardIcon,
                  {
                    backgroundColor: `${item.color}15`,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#2563eb"
          />

          <Text style={styles.footerText}>
            By using our parking services, you agree to all terms and conditions
            mentioned above.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LegalInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    backgroundColor: "#2563eb",
    paddingTop: 55,
    paddingBottom: 45,
    paddingHorizontal: 22,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  iconBox: {
    width: 95,
    height: 95,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    marginTop: 18,
  },

  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: -24,
  },

  infoCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    alignItems: "center",
  },

  infoNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },

  infoLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
  },

  section: {
    paddingHorizontal: 18,
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  cardIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  cardDesc: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 5,
    lineHeight: 20,
    paddingRight: 10,
  },

  footer: {
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  footerText: {
    flex: 1,
    marginLeft: 10,
    color: "#2563eb",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },
});
