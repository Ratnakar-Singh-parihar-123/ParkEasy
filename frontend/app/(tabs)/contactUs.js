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

const ContactUs = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="call" size={60} color="#fff" />
        </View>

        <Text style={styles.headerTitle}>Contact Us</Text>

        <Text style={styles.headerSub}>
          We are working on a better support experience for you
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={70}
          color="#2563eb"
        />

        <Text style={styles.comingText}>Coming Soon 🚀</Text>

        <Text style={styles.desc}>
          Soon you will be able to contact our support team directly through
          chat, email and call support.
        </Text>

        {/* FEATURES */}
        <View style={styles.featureCard}>
          <Ionicons name="mail-outline" size={22} color="#16a34a" />
          <Text style={styles.featureText}>Email Support</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="call-outline" size={22} color="#2563eb" />
          <Text style={styles.featureText}>24/7 Call Assistance</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="chatbox-ellipses-outline" size={22} color="#9333ea" />
          <Text style={styles.featureText}>Live Chat Support</Text>
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

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
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

  comingText: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  desc: {
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
