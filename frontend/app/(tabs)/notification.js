import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import socket from "../../src/socket/socket";
import { Audio } from "expo-av";

const API = "https://parkeasy-5qpq.onrender.com/api/notifications";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const soundRef = useRef(null);

  // ---------------- FETCH OLD NOTIFICATIONS ----------------
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log("FETCH ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SOUND (FIXED BUFFER ISSUE) ----------------
  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/mixkit-software-interface-start-2574.wav"),
        { shouldPlay: true },
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.log("SOUND ERROR:", err.message);
    }
  };

  // ---------------- SOCKET LISTENER ----------------
  useEffect(() => {
    fetchNotifications();

    const handleNewNotification = async (data) => {
      setNotifications((prev) => [data, ...prev]);
      await playSound();
      Alert.alert("🔔 New Notification", `${data.title}\n\n${data.message}`, [
        { text: "OK" },
      ]);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // ---------------- OPEN MODAL WITH SELECTED NOTIFICATION ----------------
  const openNotificationDetails = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  // ---------------- RENDER ITEM ----------------
  const renderItem = ({ item }) => {
    const time = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "Just now";

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => openNotificationDetails(item)}
      >
        <View style={styles.iconBox}>
          <Ionicons name="notifications" size={22} color="#2563eb" />
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.dot} />
            <Text style={styles.newText}>New</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>{notifications.length} updates</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {notifications.length > 99 ? "99+" : notifications.length}
          </Text>
        </View>
      </View>

      {/* BODY */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="notifications-off-outline"
            size={80}
            color="#cbd5e1"
          />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            Admin notifications will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        />
      )}

      {/* MODAL FOR NOTIFICATION DETAILS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Notification Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            {selectedNotification && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalIconWrapper}>
                  <Ionicons name="notifications" size={48} color="#2563eb" />
                </View>

                <Text style={styles.modalTitle}>
                  {selectedNotification.title}
                </Text>

                <View style={styles.modalTimeRow}>
                  <Ionicons name="time-outline" size={16} color="#64748b" />
                  <Text style={styles.modalTime}>
                    {selectedNotification.createdAt
                      ? new Date(
                          selectedNotification.createdAt,
                        ).toLocaleString()
                      : "Just now"}
                  </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.modalMessage}>
                  {selectedNotification.message}
                </Text>

                <View style={styles.modalFooter}>
                  <View style={styles.dot} />
                  <Text style={styles.modalStatus}>New Notification</Text>
                </View>
              </ScrollView>
            )}

            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 25,
    paddingTop: 70,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#fff",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#2563eb",
    fontWeight: "800",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 3,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 10,
  },
  time: {
    fontSize: 11,
    color: "#94a3b8",
  },
  message: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563eb",
    marginRight: 6,
  },
  newText: {
    fontSize: 11,
    color: "#2563eb",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    color: "#111827",
  },
  emptyText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalIconWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  modalTimeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTime: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  modalStatus: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "600",
  },
  modalCloseButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
