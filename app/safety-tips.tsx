import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { SAFETY_TIPS, SafeTip } from "@/constants/data";

type Phase = "before" | "during" | "after";

const PHASE_CONFIG = {
  before: {
    label: "Before",
    icon: "time-outline" as const,
    color: Colors.info,
    bg: "rgba(99, 179, 237, 0.12)",
    description: "Prepare yourself and your family",
  },
  during: {
    label: "During",
    icon: "warning-outline" as const,
    color: Colors.warning,
    bg: "rgba(246, 173, 85, 0.12)",
    description: "Stay safe when disaster strikes",
  },
  after: {
    label: "After",
    icon: "checkmark-circle-outline" as const,
    color: Colors.safe,
    bg: "rgba(72, 187, 120, 0.12)",
    description: "Recover and stay informed",
  },
};

function TipItem({ tip, index }: { tip: SafeTip; index: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const config = PHASE_CONFIG[tip.phase];

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(350).springify()}>
      <View style={[styles.tipItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.tipIcon, { backgroundColor: config.bg }]}>
          <Ionicons name={tip.icon as any} size={20} color={config.color} />
        </View>
        <Text style={[styles.tipText, { color: theme.text }]}>{tip.tip}</Text>
      </View>
    </Animated.View>
  );
}

export default function SafetyTipsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [activePhase, setActivePhase] = useState<Phase>("before");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const phaseTips = SAFETY_TIPS.filter((t) => t.phase === activePhase);
  const config = PHASE_CONFIG[activePhase];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 8, borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Safety Tips</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.tabsContainer, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <View style={styles.tabs}>
          {(Object.keys(PHASE_CONFIG) as Phase[]).map((phase) => {
            const cfg = PHASE_CONFIG[phase];
            const isActive = activePhase === phase;
            return (
              <Pressable
                key={phase}
                onPress={() => {
                  Haptics.selectionAsync();
                  setActivePhase(phase);
                }}
                style={[
                  styles.tab,
                  isActive
                    ? { backgroundColor: cfg.color }
                    : { backgroundColor: theme.surfaceElevated },
                ]}
              >
                <Ionicons
                  name={cfg.icon}
                  size={16}
                  color={isActive ? "#FFFFFF" : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? "#FFFFFF" : theme.textSecondary },
                  ]}
                >
                  {cfg.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 20, paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.phaseHeader, { backgroundColor: config.bg, borderRadius: 14 }]}>
          <View style={[styles.phaseIconBig, { backgroundColor: `${config.color}20` }]}>
            <Ionicons name={config.icon} size={28} color={config.color} />
          </View>
          <View>
            <Text style={[styles.phaseLabel, { color: config.color }]}>
              {config.label} Disaster
            </Text>
            <Text style={[styles.phaseDescription, { color: isDark ? "#AAAAAA" : "#555555" }]}>
              {config.description}
            </Text>
          </View>
        </View>

        <View style={styles.tipsList}>
          {phaseTips.map((tip, index) => (
            <TipItem key={tip.id} tip={tip} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  content: { paddingHorizontal: 16 },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    marginBottom: 20,
  },
  phaseIconBig: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  phaseDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  tipsList: { gap: 10 },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  tipIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
