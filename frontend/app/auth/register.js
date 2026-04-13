import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { InputField, CustomButton } from "../../src/components";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../../src/styles/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [role, setRole] = useState("user");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords not match";

    if (role === "admin" && !adminSecret) {
      newErrors.adminSecret = "Admin secret required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register(
        name,
        email,
        password,
        role === "admin" ? adminSecret : "",
      );

      if (result.success) {
        Alert.alert("Success", "Account created 🎉");
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", result.error);
      }
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="person-add" size={34} color="#fff" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up & start exploring 🚀</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <InputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              error={errors.name}
            />

            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              error={errors.email}
            />

            {/* ROLE SELECT */}
            <Text style={styles.roleTitle}>Choose Role</Text>

            <View style={styles.roleWrapper}>
              {["user", "admin"].map((item) => {
                const active = role === item;

                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setRole(item)}
                    style={[styles.roleBtn, active && styles.roleBtnActive]}
                  >
                    <Ionicons
                      name={item === "admin" ? "shield-checkmark" : "person"}
                      size={18}
                      color={active ? "#fff" : colors.textPrimary}
                    />
                    <Text
                      style={[styles.roleText, active && { color: "#fff" }]}
                    >
                      {item.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ADMIN SECRET */}
            {role === "admin" && (
              <InputField
                label="Admin Secret"
                value={adminSecret}
                onChangeText={setAdminSecret}
                secureTextEntry
                icon="key-outline"
                error={errors.adminSecret}
              />
            )}

            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.confirmPassword}
            />

            <CustomButton
              title={loading ? "Creating..." : "Create Account"}
              onPress={handleRegister}
              loading={loading}
              style={styles.btn}
            />
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.login}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  scroll: {
    padding: spacing.lg,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...shadows.md,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.lg,
  },

  roleTitle: {
    marginTop: spacing.md,
    fontWeight: "600",
    marginBottom: 8,
  },

  roleWrapper: {
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.sm,
  },

  roleBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },

  roleBtnActive: {
    backgroundColor: colors.primary,
  },

  roleText: {
    fontWeight: "600",
  },

  btn: {
    marginTop: spacing.lg,
    borderRadius: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },

  login: {
    color: colors.primary,
    fontWeight: "600",
  },
});
