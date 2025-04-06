import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function StatisticsScreen() {
  const stats = [
    {
      id: 1,
      title: "Okunan Hikayeler",
      value: "12",
      icon: "book-open-variant",
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
    },
    {
      id: 2,
      title: "Oynanan Oyunlar",
      value: "8",
      icon: "gamepad-variant",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
    },
    {
      id: 3,
      title: "Yapılan Çizimler",
      value: "5",
      icon: "pencil",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
    },
    {
      id: 4,
      title: "Kazanılan Başarılar",
      value: "3",
      icon: "trophy",
      color: "#9C27B0",
      backgroundColor: "#F3E5F5",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>İstatistiklerim</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View
              key={stat.id}
              style={[
                styles.statCard,
                { backgroundColor: stat.backgroundColor },
              ]}
            >
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons
                  name={stat.icon}
                  size={40}
                  color={stat.color}
                />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statTitle, { color: stat.color }]}>
                {stat.title}
              </Text>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 40) / 2,
    aspectRatio: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconContainer: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    textAlign: "center",
  },
});
