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

const paymentMethods = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* TOP SECTION */}
      <View style={styles.topSection}>
        <View style={styles.iconBox}>
          <Ionicons name="card-outline" size={70} color="#fff" />
        </View>

        <Text style={styles.title}>Payment Methods</Text>

        <Text style={styles.subtitle}>
          Secure payment integration is currently under development
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={22} color="#2563eb" />
          <Text style={styles.cardTitle}>Coming Soon</Text>
        </View>

        <Text style={styles.cardDesc}>
          Soon you will be able to add and manage:
        </Text>

        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>UPI Payments</Text>
        </View>

        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>Debit & Credit Cards</Text>
        </View>

        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>Wallet Integration</Text>
        </View>

        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>Auto Secure Payments</Text>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity activeOpacity={0.85} style={styles.button}>
        <Ionicons name="notifications-outline" size={22} color="#fff" />

        <Text style={styles.buttonText}>Notify Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default paymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },

  topSection: {
    alignItems: "center",
    marginTop: 60,
  },

  iconBox: {
    width: 140,
    height: 140,
    borderRadius: 40,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
    marginTop: 25,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 35,
    borderRadius: 28,
    padding: 22,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginLeft: 10,
  },

  cardDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 18,
  },

  featureBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 16,
  },

  featureText: {
    fontSize: 15,
    color: "#111827",
    marginLeft: 12,
    fontWeight: "600",
  },

  button: {
    marginTop: 35,
    height: 60,
    backgroundColor: "#2563eb",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },
});
