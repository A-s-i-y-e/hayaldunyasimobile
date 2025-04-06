import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function StoriesScreen() {
  const navigation = useNavigation();

  const userStats = {
    readStories: 15,
    createdStories: 3,
    favoriteStories: 8,
    totalTime: "5 saat",
  };

  const storyItems = [
    {
      id: 1,
      title: "Masal Dünyası",
      description: "Klasik masalları keşfet",
      icon: "book-open-variant",
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
      screen: "FairyTales",
    },
    {
      id: 2,
      title: "Yeni Hikayeler",
      description: "Yeni oluşturulan hikayeleri gör",
      icon: "book-plus",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
      screen: "NewStories",
    },
    {
      id: 3,
      title: "Favorilerim",
      description: "Kaydettiğin hikayeleri görüntüle",
      icon: "heart",
      color: "#E91E63",
      backgroundColor: "#FCE4EC",
      screen: "Favorites",
    },
    {
      id: 4,
      title: "Hikaye Oluştur",
      description: "Yeni bir hikaye oluştur",
      icon: "plus-circle",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
      screen: "CreateStory",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hikayeler</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <Image
              source={{ uri: "https://example.com/profile.jpg" }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.username}>Ahmet Yılmaz</Text>
              <Text style={styles.userEmail}>ahmet@example.com</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={24}
                color="#fff"
              />
              <Text style={styles.statValue}>{userStats.readStories}</Text>
              <Text style={styles.statLabel}>Okunan</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
              <Text style={styles.statValue}>{userStats.createdStories}</Text>
              <Text style={styles.statLabel}>Oluşturulan</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="heart" size={24} color="#fff" />
              <Text style={styles.statValue}>{userStats.favoriteStories}</Text>
              <Text style={styles.statLabel}>Favori</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock" size={24} color="#fff" />
              <Text style={styles.statValue}>{userStats.totalTime}</Text>
              <Text style={styles.statLabel}>Toplam Süre</Text>
            </View>
          </View>
        </View>

        {storyItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.storyItem,
              { backgroundColor: item.backgroundColor },
            ]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.storyContent}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={item.color}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.storyTitle, { color: item.color }]}>
                  {item.title}
                </Text>
                <Text style={styles.storyDescription}>{item.description}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={item.color}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  storyItem: {
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  storyContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  storyDescription: {
    fontSize: 12,
    color: "#666",
  },
});
