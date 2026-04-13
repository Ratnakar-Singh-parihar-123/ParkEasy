import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { colors } from "../src/styles/theme";

export default function Index() {
  const { isLoggedIn, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isLoggedIn) {
    if (isAdmin) {
      return <Redirect href="/(admin)/dashboard" />;
    }
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
