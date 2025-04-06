import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AchievementsScreen() {
  const achievements = [
    {
      id: 1,
      title: "İlk Hikaye",
      description: "İlk hikayeyi okuma başarısı",
      icon: "book-open-variant",
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
      unlocked: true,
    },
    {
      id: 2,
      title: "Oyun Ustası",
      description: "5 oyunu tamamlama başarısı",
      icon: "gamepad-variant",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
      unlocked: true,
    },
    {
      id: 3,
      title: "Sanatçı",
      description: "3 çizim yapma başarısı",
      icon: "pencil",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
      unlocked: false,
    },
    {
      id: 4,
      title: "Hikaye Ustası",
      description: "10 hikaye okuma başarısı",
      icon: "book-multiple",
      color: "#9C27B0",
      backgroundColor: "#F3E5F5",
      unlocked: false,
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Başarılarım</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.achievementsList}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                { backgroundColor: achievement.backgroundColor },
              ]}
            >
              <View style={styles.achievementIconContainer}>
                <MaterialCommunityIcons
                  name={achievement.icon}
                  size={40}
                  color={achievement.color}
                />
                {!achievement.unlocked && (
                  <View style={styles.lockIconContainer}>
                    <MaterialCommunityIcons
                      name="lock"
                      size={20}
                      color={achievement.color}
                    />
                  </View>
                )}
              </View>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementTitle,
                    { color: achievement.color },
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    { color: achievement.color },
                  ]}
                >
                  {achievement.description}
                </Text>
              </View>
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
  achievementsList: {
    padding: 15,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  achievementIconContainer: {
    position: "relative",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
  },
});
