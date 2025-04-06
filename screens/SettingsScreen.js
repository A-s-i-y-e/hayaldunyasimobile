import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const settingsItems = [
    {
      id: 1,
      title: "Bildirimler",
      icon: "bell",
      value: notifications,
      onValueChange: setNotifications,
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
    },
    {
      id: 2,
      title: "Karanlık Mod",
      icon: "theme-light-dark",
      value: darkMode,
      onValueChange: setDarkMode,
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
    },
    {
      id: 3,
      title: "Ses Efektleri",
      icon: "volume-high",
      value: soundEffects,
      onValueChange: setSoundEffects,
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.settingItem,
                { backgroundColor: item.backgroundColor },
              ]}
            >
              <View style={styles.settingItemContent}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={30}
                  color={item.color}
                />
                <Text style={[styles.settingItemText, { color: item.color }]}>
                  {item.title}
                </Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onValueChange}
                trackColor={{ false: "#767577", true: item.color }}
                thumbColor={item.value ? "#fff" : "#f4f3f4"}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  settingsList: {
    padding: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  settingItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 15,
  },
});
