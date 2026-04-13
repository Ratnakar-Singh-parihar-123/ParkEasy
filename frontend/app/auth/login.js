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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.isAdmin) {
          router.replace("/(admin)/dashboard");
        } else {
          router.replace("/(tabs)/home");
        }
      } else {
        Alert.alert("Login Failed", result.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="car-sport" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>ParkEasy</Text>
            <Text style={styles.subtitle}>Find & Book Parking Spots</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.instructionText}>Sign in to continue</Text>

            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="large"
              style={styles.loginButton}
            />
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.registerLink}> Sign Up</Text>
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
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  welcomeText: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  instructionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
  },

  adminDemoText: {
    color: colors.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },
});
