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
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { DISASTER_INFO, DisasterInfo } from "@/constants/data";

function DisasterCard({ info, index }: { info: DisasterInfo; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);
  const contentHeight = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggle = () => {
    Haptics.selectionAsync();
    setExpanded(!expanded);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
      <Animated.View style={animStyle}>
        <Pressable
          onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
          onPress={handleToggle}
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: `${info.color}18` }]}>
              <Ionicons name={info.icon as any} size={26} color={info.color} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{info.type}</Text>
              <Text style={[styles.cardPreview, { color: theme.textSecondary }]} numberOfLines={expanded ? undefined : 1}>
                {info.description}
              </Text>
            </View>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={theme.textMuted}
            />
          </View>

          {expanded && (
            <View style={styles.expandedContent}>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: "rgba(229, 62, 62, 0.1)" }]}>
                    <Ionicons name="warning-outline" size={14} color={Colors.danger} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: Colors.danger }]}>Possible Dangers</Text>
                </View>
                <View style={styles.listItems}>
                  {info.dangers.map((danger, i) => (
                    <View key={i} style={styles.listItem}>
                      <View style={[styles.bullet, { backgroundColor: Colors.danger }]} />
                      <Text style={[styles.listText, { color: theme.textSecondary }]}>{danger}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={[styles.section, { marginTop: 12 }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: "rgba(72, 187, 120, 0.1)" }]}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={Colors.safe} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: Colors.safe }]}>What To Do</Text>
                </View>
                <View style={styles.listItems}>
                  {info.actions.map((action, i) => (
                    <View key={i} style={styles.listItem}>
                      <Text style={[styles.stepNum, { color: info.color }]}>{i + 1}</Text>
                      <Text style={[styles.listText, { color: theme.textSecondary }]}>{action}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function DisasterInfoScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 8, borderBottomColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Disaster Info</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 16, paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.intro, { color: theme.textSecondary }]}>
          Learn about different types of disasters, understand the risks, and know what to do when they happen.
        </Text>

        <View style={styles.cardList}>
          {DISASTER_INFO.map((info, index) => (
            <DisasterCard key={info.id} info={info} index={index} />
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
  content: { paddingHorizontal: 16 },
  intro: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  cardList: { gap: 10 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  cardPreview: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  expandedContent: { marginTop: 14 },
  divider: { height: 1, marginBottom: 14 },
  section: {},
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  listItems: { gap: 8, paddingLeft: 4 },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  stepNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    width: 16,
    flexShrink: 0,
  },
  listText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});
