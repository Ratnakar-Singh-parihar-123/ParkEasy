import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MyVehicles = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="car-sport" size={65} color="#fff" />
        </View>

        <Text style={styles.headerTitle}>My Vehicles</Text>

        <Text style={styles.headerSub}>
          Manage and track all your registered vehicles in one place
        </Text>
      </View>

      {/* MAIN CARD */}
      <View style={styles.card}>
        <Ionicons name="car-outline" size={75} color="#2563eb" />

        <Text style={styles.comingSoon}>Coming Soon 🚗</Text>

        <Text style={styles.description}>
          Soon you’ll be able to add, edit and manage your vehicles with smart
          parking access and booking history.
        </Text>

        {/* FEATURES */}
        <View style={styles.featureCard}>
          <Ionicons name="add-circle-outline" size={22} color="#16a34a" />
          <Text style={styles.featureText}>Add Multiple Vehicles</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="create-outline" size={22} color="#2563eb" />
          <Text style={styles.featureText}>Edit Vehicle Details</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#9333ea" />
          <Text style={styles.featureText}>Secure Vehicle Verification</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="time-outline" size={22} color="#f59e0b" />
          <Text style={styles.featureText}>Parking History Tracking</Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity activeOpacity={0.85} style={styles.button}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />

          <Text style={styles.buttonText}>Notify Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyVehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    backgroundColor: "#2563eb",
    paddingTop: 60,
    paddingBottom: 45,
    paddingHorizontal: 22,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    marginTop: 18,
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },

  headerSub: {
    marginTop: 10,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },

  comingSoon: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  description: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },

  featureCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 18,
    marginTop: 14,
  },

  featureText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  button: {
    marginTop: 28,
    backgroundColor: "#2563eb",
    height: 58,
    borderRadius: 18,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },
});
