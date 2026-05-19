import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const API = "https://parkeasy-5qpq.onrender.com/api/auth/change-password";

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (newPassword.length < 6) {
      return Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters",
      );
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert(
        "Password Mismatch",
        "New password and confirm password do not match",
      );
    }

    try {
      setLoading(true);

      // GET TOKEN
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return Alert.alert("Unauthorized", "Please login again");
      }

      // API CALL
      const response = await axios.put(
        API,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert(
        "Success",
        response.data.message || "Password changed successfully",
      );

      // CLEAR INPUTS
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(
        "CHANGE PASSWORD ERROR:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.lockBox}>
            <Ionicons name="shield-checkmark" size={42} color="#fff" />
          </View>

          <Text style={styles.headerTitle}>Change Password</Text>

          <Text style={styles.headerSub}>
            Secure your account by updating your password regularly
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* CURRENT PASSWORD */}
          <Text style={styles.label}>Current Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#64748b" />

            <TextInput
              placeholder="Enter current password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showCurrent}
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons
                name={showCurrent ? "eye" : "eye-off"}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          {/* NEW PASSWORD */}
          <Text style={styles.label}>New Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="shield-outline" size={22} color="#64748b" />

            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showNew}
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Ionicons
                name={showNew ? "eye" : "eye-off"}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#64748b"
            />

            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showConfirm}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye" : "eye-off"}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          {/* INFO BOX */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={22} color="#2563eb" />

            <Text style={styles.infoText}>
              Password must contain at least 6 characters for better security.
            </Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={22} color="#fff" />

                <Text style={styles.buttonText}>Update Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

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

  lockBox: {
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
    paddingHorizontal: 12,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 28,
    padding: 20,
    elevation: 5,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    marginTop: 15,
  },

  inputContainer: {
    height: 60,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    color: "#111827",
    fontSize: 15,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 15,
    borderRadius: 18,
    marginTop: 22,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: "#2563eb",
    lineHeight: 20,
    fontWeight: "500",
    fontSize: 13,
  },

  button: {
    height: 60,
    backgroundColor: "#2563eb",
    borderRadius: 18,
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },
});
