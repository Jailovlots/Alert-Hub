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
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { Alert, SeverityLevel } from "@shared/schema";
import { ALERTS as STATIC_ALERTS } from "@/constants/data";

type FilterType = "All" | SeverityLevel;

const SEVERITY_CONFIG = {
  High: { color: Colors.danger, bg: "rgba(229, 62, 62, 0.12)", label: "HIGH" },
  Medium: { color: Colors.warning, bg: "rgba(246, 173, 85, 0.12)", label: "MEDIUM" },
  Low: { color: Colors.safe, bg: "rgba(72, 187, 120, 0.12)", label: "LOW" },
};

const DISASTER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  typhoon: "thunderstorm-outline",
  flood: "water-outline",
  earthquake: "earth-outline",
  landslide: "layers-outline",
  fire: "flame-outline",
};

function AlertCard({ alert, delay }: { alert: Alert; delay: number }) {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const severity = SEVERITY_CONFIG[alert.severity];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <Animated.View style={animStyle}>
        <Pressable
          onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
          style={[
            styles.alertCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconBg, { backgroundColor: severity.bg }]}>
              <Ionicons
                name={DISASTER_ICONS[alert.type] || "alert-circle-outline"}
                size={24}
                color={severity.color}
              />
            </View>
            <View style={styles.cardMeta}>
              <View style={[styles.severityBadge, { backgroundColor: severity.bg }]}>
                <View style={[styles.severityDot, { backgroundColor: severity.color }]} />
                <Text style={[styles.severityText, { color: severity.color }]}>
                  {severity.label}
                </Text>
              </View>
              <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
                {alert.date}
              </Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{alert.title}</Text>
          <View style={[styles.locationRow, { backgroundColor: theme.surfaceElevated }]}>
            <Ionicons name="location-outline" size={12} color={theme.textSecondary} />
            <Text style={[styles.locationText, { color: theme.textSecondary }]}>
              {alert.location}
            </Text>
          </View>
          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            {alert.description}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [filter, setFilter] = useState<FilterType>("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const { data: realTimeAlerts, isLoading, error } = useQuery<Alert[]>({
    queryKey: ["alerts"],
  });

  const alerts = realTimeAlerts && realTimeAlerts.length > 0 ? realTimeAlerts : STATIC_ALERTS;
  const filtered = filter === "All" ? alerts : alerts.filter((a: Alert) => a.severity === filter);

  const FILTERS: FilterType[] = ["All", "High", "Medium", "Low"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 8, borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Latest Alerts</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.filtersRow, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => {
                Haptics.selectionAsync();
                setFilter(f);
              }}
              style={[
                styles.filterChip,
                filter === f
                  ? { backgroundColor: Colors.danger }
                  : { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderWidth: 1 },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f ? "#FFFFFF" : theme.textSecondary },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 16, paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.textSecondary }}>Checking for real-time alerts...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={Colors.safe} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Alerts</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              No {filter === "All" ? "" : filter.toLowerCase()} alerts at this time
            </Text>
          </View>
        ) : (
          <View style={styles.alertList}>
            {filtered.map((alert: Alert, i: number) => (
              <AlertCard key={alert.id} alert={alert} delay={i * 80} />
            ))}
          </View>
        )}
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
  filtersRow: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  content: { paddingHorizontal: 16 },
  alertList: { gap: 12 },
  alertCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardMeta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  severityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  severityText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  cardDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
