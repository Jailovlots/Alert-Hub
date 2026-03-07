import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  useColorScheme,
  Alert,
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
import { EMERGENCY_CONTACTS, EmergencyContact } from "@/constants/data";

function ContactCard({ contact, index }: { contact: EmergencyContact; index: number }) {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const phoneNumber = `tel:${contact.phone.replace(/[^0-9+]/g, "")}`;
    Linking.canOpenURL(phoneNumber).then((supported) => {
      if (supported) {
        Linking.openURL(phoneNumber);
      } else {
        Alert.alert(
          "Call " + contact.name,
          `Dial: ${contact.phone}`,
          [{ text: "OK" }]
        );
      }
    });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
      <Animated.View style={animStyle}>
        <Pressable
          onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
          style={[
            styles.contactCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.iconBg, { backgroundColor: `${contact.color}18` }]}>
              <Ionicons name={contact.icon as any} size={24} color={contact.color} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: theme.text }]}>{contact.name}</Text>
              <Text style={[styles.contactDept, { color: theme.textSecondary }]}>
                {contact.department}
              </Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={12} color={theme.textMuted} />
                <Text style={[styles.phoneNumber, { color: theme.textSecondary }]}>
                  {contact.phone}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPressIn={() => { scale.value = withSpring(0.95, { damping: 15 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
            onPress={handleCall}
            style={[styles.callButton, { backgroundColor: contact.color }]}
          >
            <Ionicons name="call" size={18} color="#FFFFFF" />
          </Pressable>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function EmergencyContactsScreen() {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Emergency Contacts</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 20, paddingBottom: bottomPadding + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.emergencyBanner, { backgroundColor: "rgba(229, 62, 62, 0.1)", borderColor: "rgba(229, 62, 62, 0.25)" }]}>
          <Ionicons name="warning" size={20} color={Colors.danger} />
          <Text style={[styles.bannerText, { color: Colors.dangerLight }]}>
            In case of immediate danger, dial{" "}
            <Text style={{ color: Colors.danger, fontFamily: "Inter_700Bold" }}>911</Text>{" "}
            for emergency services.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          HOTLINES
        </Text>

        <View style={styles.contactList}>
          {EMERGENCY_CONTACTS.map((contact, index) => (
            <ContactCard key={contact.id} contact={contact} index={index} />
          ))}
        </View>

        <View style={[styles.noteBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.noteText, { color: theme.textSecondary }]}>
            Save these numbers on your phone before a disaster. Networks may be overloaded during emergencies.
          </Text>
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
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  bannerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  contactList: { gap: 10, marginBottom: 24 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: { flex: 1 },
  contactName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  contactDept: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  phoneNumber: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  noteBox: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "flex-start",
  },
  noteText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
