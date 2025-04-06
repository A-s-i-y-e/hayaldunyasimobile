import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 sütun için hesaplama

export default function NewStoriesScreen() {
  const navigation = useNavigation();
  const newStories = [
    {
      id: 1,
      title: "Uzay Macerası",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995597.png",
      author: "Ayşe Yılmaz",
      date: "2 gün önce",
      readTime: "1 saat",
      description: "Ali ve Ayşe'nin uzaylılarla yaşadığı büyülü macera...",
      backgroundColor: "#E3F2FD",
      textColor: "#1976D2",
    },
    {
      id: 2,
      title: "Ormanın Sırrı",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995598.png",
      author: "Mehmet Demir",
      date: "3 gün önce",
      readTime: "45 dk",
      description:
        "Zeynep'in ormanın derinliklerinde keşfettiği büyülü dünya...",
      backgroundColor: "#F3E5F5",
      textColor: "#7B1FA2",
    },
    {
      id: 3,
      title: "Deniz Altı Dünyası",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995599.png",
      author: "Zeynep Kaya",
      date: "4 gün önce",
      readTime: "1.5 saat",
      description: "Mehmet'in deniz altında yaşadığı unutulmaz macera...",
      backgroundColor: "#FFF3E0",
      textColor: "#E65100",
    },
    {
      id: 4,
      title: "Büyülü Kutu",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995600.png",
      author: "Ali Şahin",
      date: "5 gün önce",
      readTime: "30 dk",
      description: "Can'ın bulduğu büyülü kutunun sırrı...",
      backgroundColor: "#E8F5E9",
      textColor: "#2E7D32",
    },
    {
      id: 5,
      title: "Gizemli Ada",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995601.png",
      author: "Fatma Öztürk",
      date: "1 hafta önce",
      readTime: "2 saat",
      description: "Ela'nın haritada bulduğu gizemli adadaki macerası...",
      backgroundColor: "#FFEBEE",
      textColor: "#C62828",
    },
    {
      id: 6,
      title: "Zaman Yolculuğu",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995602.png",
      author: "Can Yıldız",
      date: "1 hafta önce",
      readTime: "1 saat",
      description: "Deniz'in zaman makinesiyle yaşadığı macera...",
      backgroundColor: "#E0F7FA",
      textColor: "#00838F",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yeni Hikayeler</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.storiesGrid}>
          {newStories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={[
                styles.card,
                { width: CARD_WIDTH, backgroundColor: story.backgroundColor },
              ]}
            >
              <Image source={{ uri: story.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: story.textColor }]}>
                  {story.title}
                </Text>
                <Text
                  style={[styles.description, { color: story.textColor }]}
                  numberOfLines={2}
                >
                  {story.description}
                </Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="account"
                      size={14}
                      color={story.textColor}
                    />
                    <Text style={[styles.infoText, { color: story.textColor }]}>
                      {story.author}
                    </Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={14}
                      color={story.textColor}
                    />
                    <Text style={[styles.dateText, { color: story.textColor }]}>
                      {story.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  <View style={styles.readTimeContainer}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={story.textColor}
                    />
                    <Text style={[styles.readTime, { color: story.textColor }]}>
                      {story.readTime}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.readButton,
                      { backgroundColor: story.textColor },
                    ]}
                    onPress={() =>
                      navigation.navigate("StoryDetail", { story: story })
                    }
                  >
                    <Text style={styles.readButtonText}>Oku</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
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
  storiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 80,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    objectFit: "contain",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 14,
  },
  infoContainer: {
    flexDirection: "column",
    marginBottom: 0,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readTime: {
    fontSize: 12,
    marginLeft: 4,
  },
  readButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  readButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
