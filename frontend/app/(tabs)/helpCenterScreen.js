import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const HelpCenterScreen = () => {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I book a parking slot?",
      answer:
        "Open the app, choose your parking location, select a slot and confirm your booking.",
    },
    {
      id: 2,
      question: "How can I cancel my booking?",
      answer:
        "Go to My Bookings section and tap on cancel booking before the booking time starts.",
    },
    {
      id: 3,
      question: "How do refunds work?",
      answer:
        "Refunds are processed within 3-5 business days directly to your payment method.",
    },
    {
      id: 4,
      question: "How do I contact support?",
      answer:
        "You can contact support using the Help Center support section or report an issue.",
    },
  ];

  const guides = [
    {
      id: 1,
      title: "Booking Guide",
      icon: "car-sport",
      color: "#2563eb",
    },
    {
      id: 2,
      title: "Payment Guide",
      icon: "card",
      color: "#16a34a",
    },
    {
      id: 3,
      title: "Refund Process",
      icon: "cash",
      color: "#f59e0b",
    },
    {
      id: 4,
      title: "Safety Rules",
      icon: "shield-checkmark",
      color: "#9333ea",
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
          <View style={styles.headerIcon}>
            <Ionicons name="help-buoy" size={42} color="#fff" />
          </View>

          <Text style={styles.headerTitle}>Help Center</Text>

          <Text style={styles.headerSub}>
            FAQs, guides and support for parking users
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />

          <TextInput
            placeholder="Search help articles..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickSection}>
          <TouchableOpacity style={styles.quickCard}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#2563eb" />

            <Text style={styles.quickTitle}>Live Chat</Text>

            <Text style={styles.quickDesc}>Talk with support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <Ionicons name="call" size={28} color="#16a34a" />

            <Text style={styles.quickTitle}>Call Support</Text>

            <Text style={styles.quickDesc}>24/7 customer help</Text>
          </TouchableOpacity>
        </View>

        {/* GUIDES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Guides</Text>

          {guides.map((item) => (
            <TouchableOpacity
              activeOpacity={0.85}
              key={item.id}
              style={styles.guideCard}
            >
              <View
                style={[
                  styles.guideIcon,
                  {
                    backgroundColor: `${item.color}15`,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.guideTitle}>{item.title}</Text>

                <Text style={styles.guideDesc}>
                  Read detailed step by step instructions
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {faqs.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.faqCard}
              onPress={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <View style={styles.faqTop}>
                <Text style={styles.faqQuestion}>{item.question}</Text>

                <Ionicons
                  name={expanded === item.id ? "remove-circle" : "add-circle"}
                  size={24}
                  color="#2563eb"
                />
              </View>

              {expanded === item.id && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* SUPPORT CARD */}
        <View style={styles.supportCard}>
          <Ionicons
            name="headset"
            size={36}
            color="#2563eb"
            style={{ marginBottom: 12 }}
          />

          <Text style={styles.supportTitle}>Still Need Help?</Text>

          <Text style={styles.supportText}>
            Contact our support team and we’ll help you solve your issue
            quickly.
          </Text>

          <TouchableOpacity activeOpacity={0.85} style={styles.supportBtn}>
            <Text style={styles.supportBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    backgroundColor: "#2563eb",
    paddingTop: 55,
    paddingBottom: 40,
    paddingHorizontal: 22,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerIcon: {
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

  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 15,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#111827",
    fontSize: 15,
  },

  quickSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 24,
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    elevation: 3,
  },

  quickTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 12,
  },

  quickDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 18,
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 18,
  },

  guideCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
  },

  guideIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  guideTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  guideDesc: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 5,
  },

  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
  },

  faqTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    paddingRight: 12,
  },

  faqAnswer: {
    marginTop: 14,
    color: "#64748b",
    lineHeight: 22,
    fontSize: 13,
  },

  supportCard: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 30,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    elevation: 3,
  },

  supportTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  supportText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 13,
  },

  supportBtn: {
    marginTop: 22,
    backgroundColor: "#2563eb",
    height: 54,
    borderRadius: 18,
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  supportBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
