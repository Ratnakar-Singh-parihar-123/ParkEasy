import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../../src/styles/theme";

const ForgetPassword = () => {
  const router = useRouter();

  // STEPS
  const [step, setStep] = useState(1);

  // STATES
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // SEND OTP
  const handleSendOTP = async () => {
    try {
      if (!email) {
        return Alert.alert("Error", "Please enter email");
      }

      setLoading(true);

      const response = await axios.post(
        "https://parkeasy-5qpq.onrender.com/api/auth/forgot-password",
        { email },
      );

      Alert.alert("Success", response.data.message);

      // OPEN OTP SECTION
      setStep(2);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async () => {
    try {
      if (!otp) {
        return Alert.alert("Error", "Please enter OTP");
      }

      setLoading(true);

      const response = await axios.post(
        "https://parkeasy-5qpq.onrender.com/api/auth/verify-otp",
        {
          email,
          otp,
        },
      );

      Alert.alert("Success", response.data.message);

      // OPEN RESET PASSWORD SECTION
      setStep(3);
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    try {
      if (!newPassword) {
        return Alert.alert("Error", "Please enter new password");
      }

      setLoading(true);

      const response = await axios.post(
        "https://parkeasy-5qpq.onrender.com/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );

      Alert.alert("Success", response.data.message);

      // REDIRECT LOGIN
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* TOP SECTION */}
        <View style={styles.topContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={
                step === 1
                  ? "mail"
                  : step === 2
                    ? "shield-checkmark"
                    : "lock-closed"
              }
              size={42}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            {step === 1
              ? "Forgot Password?"
              : step === 2
                ? "Verify OTP"
                : "Create New Password"}
          </Text>

          <Text style={styles.subtitle}>
            {step === 1
              ? "Enter your email to receive OTP."
              : step === 2
                ? "Enter the OTP sent to your email."
                : "Create a strong new password."}
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color={colors.textSecondary}
                />

                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Send OTP</Text>

                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Text style={styles.label}>Enter OTP</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="key-outline"
                  size={22}
                  color={colors.textSecondary}
                />

                <TextInput
                  placeholder="Enter 6 digit OTP"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify OTP</Text>

                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <Text style={styles.label}>New Password</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={colors.textSecondary}
                />

                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Change Password</Text>

                    <Ionicons name="lock-open" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* BACK */}
          <TouchableOpacity onPress={() => router.back("/auth/login")}>
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  topContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.lg,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
  },

  card: {
    flex: 0.6,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: spacing.xl,
    ...shadows.lg,
  },

  label: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 60,
    marginBottom: spacing.xl,
  },

  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },

  button: {
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  buttonText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: "700",
  },

  backText: {
    textAlign: "center",
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginTop: spacing.md,
  },
});
