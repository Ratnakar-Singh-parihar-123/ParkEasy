import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";

import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const CreateNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetching, setFetching] = useState(true);

  const API = "https://parkeasy-5qpq.onrender.com/api/notifications";

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreateNotification = async () => {
    if (!title || !message) return;

    try {
      setLoading(true);

      await axios.post(`${API}/create`, { title, message });

      setTitle("");
      setMessage("");

      fetchNotifications();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.iconBox}>
          <Ionicons name="notifications" size={20} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item._id)}
      >
        <Ionicons name="trash" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={34} color="#fff" />
        <Text style={styles.headerTitle}>Admin Notifications</Text>
        <Text style={styles.headerSub}>Total: {notifications.length}</Text>
      </View>

      {/* FORM CARD */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Enter title"
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={[styles.input, { height: 90 }]}
          placeholder="Enter message"
          multiline
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateNotification}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.btnText}>Send Notification</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <View style={{ flex: 1, padding: 15 }}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>

        {fetching ? (
          <ActivityIndicator size="large" />
        ) : notifications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off" size={60} color="#cbd5e1" />
            <Text>No notifications yet</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

export default CreateNotification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    backgroundColor: "#2563eb",
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
    paddingTop: 45,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
  },

  headerSub: {
    color: "#e5e7eb",
    marginTop: 4,
  },

  formCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 4,
  },

  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  button: {
    marginTop: 15,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },

  cardLeft: {
    flexDirection: "row",
    flex: 1,
  },

  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },

  cardMessage: {
    color: "#6b7280",
    fontSize: 12,
  },

  deleteBtn: {
    padding: 8,
  },

  empty: {
    alignItems: "center",
    marginTop: 50,
  },
});
