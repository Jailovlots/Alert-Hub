import React from "react";
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
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { ALERTS } from "@/constants/data";

interface MenuCard {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  bgColor: string;
}

const MENU_CARDS: MenuCard[] = [
  {
    title: "Latest Alerts",
    subtitle: "Active warnings & advisories",
    icon: "alert-circle",
    route: "/alerts",
    color: "#E53E3E",
    bgColor: "rgba(229, 62, 62, 0.12)",
  },
  {
    title: "Disaster Info",
    subtitle: "Know your risks",
    icon: "book-outline",
    route: "/disaster-info",
    color: "#F6AD55",
    bgColor: "rgba(246, 173, 85, 0.12)",
  },
  {
    title: "Safety Tips",
    subtitle: "Before, during & after",
    icon: "shield-checkmark-outline",
    route: "/safety-tips",
    color: "#48BB78",
    bgColor: "rgba(72, 187, 120, 0.12)",
  },
  {
    title: "Emergency Contacts",
    subtitle: "Call for help instantly",
    icon: "call-outline",
    route: "/emergency-contacts",
    color: "#63B3ED",
    bgColor: "rgba(99, 179, 237, 0.12)",
  },
];

function AnimatedMenuCard({ card, index }: { card: MenuCard; index: number }) {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(card.route as any);
  };

  return (
    <Animated.View style={[styles.cardWrapper, animStyle]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
        onPress={handlePress}
        style={[
          styles.menuCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={[styles.cardIconBg, { backgroundColor: card.bgColor }]}>
          <Ionicons name={card.icon} size={28} color={card.color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{card.title}</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            {card.subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  const activeAlerts = ALERTS.filter((a) => a.severity === "High");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Community Safety
            </Text>
            <Text style={[styles.appTitle, { color: theme.text }]}>
              Disaster Alert
            </Text>
          </View>
          <View style={[styles.shieldBadge, { backgroundColor: "rgba(229, 62, 62, 0.12)" }]}>
            <Ionicons name="shield" size={24} color={Colors.danger} />
          </View>
        </View>

        {activeAlerts.length > 0 && (
          <Pressable
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              router.push("/alerts");
            }}
            style={[styles.alertBanner, { backgroundColor: "rgba(229, 62, 62, 0.1)", borderColor: "rgba(229, 62, 62, 0.3)" }]}
          >
            <View style={styles.alertBannerLeft}>
              <Ionicons name="warning" size={20} color={Colors.danger} />
              <View style={styles.alertBannerText}>
                <Text style={[styles.alertBannerTitle, { color: Colors.danger }]}>
                  {activeAlerts.length} Active High Alert{activeAlerts.length > 1 ? "s" : ""}
                </Text>
                <Text style={[styles.alertBannerSubtitle, { color: Colors.dangerLight }]}>
                  Tap to view latest warnings
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.danger} />
          </Pressable>
        )}

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          QUICK ACCESS
        </Text>

        <View style={styles.menuList}>
          {MENU_CARDS.map((card, index) => (
            <AnimatedMenuCard key={card.route} card={card} index={index} />
          ))}
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            This app provides disaster preparedness information for your community. Always follow official government advisories.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  appTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    letterSpacing: -0.5,
  },
  shieldBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  alertBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  alertBannerText: { flex: 1 },
  alertBannerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  alertBannerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  menuList: { gap: 10, marginBottom: 24 },
  cardWrapper: {},
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  cardIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "flex-start",
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
