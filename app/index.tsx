import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

export default function SplashScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const shieldOpacity = useSharedValue(0);
  const shieldScale = useSharedValue(0.6);
  const textOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const indicatorOpacity = useSharedValue(0);

  const navigateToHome = () => {
    router.replace("/home");
  };

  useEffect(() => {
    shieldOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
    });
    shieldScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
    });
    textOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 500 })
    );
    subtitleOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 500 })
    );
    indicatorOpacity.value = withDelay(
      1200,
      withTiming(1, { duration: 400 })
    );

    const timer = setTimeout(() => {
      navigateToHome();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const shieldStyle = useAnimatedStyle(() => ({
    opacity: shieldOpacity.value,
    transform: [{ scale: shieldScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: withTiming(textOpacity.value === 0 ? 20 : 0, { duration: 500 }) }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "#0D0D0F",
          paddingTop: insets.top,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
        },
      ]}
    >
      <Animated.View style={[styles.iconContainer, shieldStyle]}>
        <View style={styles.shieldWrapper}>
          <Ionicons name="shield" size={100} color={Colors.danger} />
          <View style={styles.warningOverlay}>
            <Ionicons name="warning" size={44} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.title, textStyle]}>
        Disaster Alert
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Stay informed. Stay safe.
      </Animated.Text>

      <Animated.View style={[styles.dots, indicatorStyle]}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  shieldWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  warningOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 28,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: "#F0F0F2",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#8E8E93",
    letterSpacing: 0.2,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2A2A2D",
  },
  dotActive: {
    backgroundColor: Colors.danger,
    width: 24,
  },
});
