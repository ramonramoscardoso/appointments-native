import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function BackButton() {
  const pathname = usePathname();

  const isHomePage = pathname === "/" || pathname === "/index";
  if (isHomePage) return null;

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <TouchableOpacity style={styles.backButton} onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 100,
    left: 20,
    zIndex: 10,
  },
});
