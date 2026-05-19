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

const personalInformation = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* TOP SECTION */}
      <View style={styles.topSection}>
        <View style={styles.iconBox}>
          <Ionicons name="person-circle" size={70} color="#fff" />
        </View>

        <Text style={styles.title}>Coming Soon</Text>

        <Text style={styles.subtitle}>
          Personal Information feature is currently under development.
        </Text>
      </View>

      {/* CONTENT CARD */}
      <View style={styles.card}>
        <Ionicons
          name="construct-outline"
          size={55}
          color="#2563eb"
          style={{ marginBottom: 16 }}
        />

        <Text style={styles.cardTitle}>
          We’re Building Something Amazing 🚀
        </Text>

        <Text style={styles.cardText}>
          Soon you’ll be able to update your profile details, contact
          information, security preferences and much more directly from this
          section.
        </Text>

        {/* FEATURES */}
        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>Edit Personal Details</Text>
        </View>

        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>Update Phone & Email</Text>
        </View>

        <View style={styles.featureBox}>
          <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          <Text style={styles.featureText}>Secure Account Management</Text>
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

export default personalInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  topSection: {
    backgroundColor: "#2563eb",
    paddingTop: 60,
    paddingBottom: 45,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingHorizontal: 20,
  },

  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },

  subtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
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

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  cardText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },

  featureBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
  },

  featureText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  button: {
    marginTop: 28,
    backgroundColor: "#2563eb",
    height: 56,
    borderRadius: 18,
    paddingHorizontal: 28,
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
