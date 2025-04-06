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

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const favorites = [
    {
      id: 1,
      title: "Küçük Prens",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995591.png",
      author: "Antoine de Saint-Exupéry",
      category: "Klasik",
      readTime: "2 saat",
      description:
        "Küçük bir prensin gezegenler arası yolculuğu ve hayatın anlamını arayışı...",
      backgroundColor: "#E3F2FD",
      textColor: "#1976D2",
    },
    {
      id: 2,
      title: "Alice Harikalar Diyarında",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995592.png",
      author: "Lewis Carroll",
      category: "Fantastik",
      readTime: "1.5 saat",
      description:
        "Alice'in tavşan deliğinden geçerek başlayan büyülü macerası...",
      backgroundColor: "#F3E5F5",
      textColor: "#7B1FA2",
    },
    {
      id: 3,
      title: "Pinokyo",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995593.png",
      author: "Carlo Collodi",
      category: "Macera",
      readTime: "2.5 saat",
      description:
        "Tahta kukladan gerçek bir çocuğa dönüşen Pinokyo'nun hikayesi...",
      backgroundColor: "#FFF3E0",
      textColor: "#E65100",
    },
    {
      id: 4,
      title: "Peter Pan",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995594.png",
      author: "J.M. Barrie",
      category: "Fantastik",
      readTime: "2 saat",
      description: "Hiç büyümeyen çocuğun Neverland'deki maceraları...",
      backgroundColor: "#E8F5E9",
      textColor: "#2E7D32",
    },
    {
      id: 5,
      title: "Kırmızı Başlıklı Kız",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995595.png",
      author: "Grimm Kardeşler",
      category: "Masal",
      readTime: "1 saat",
      description: "Ormanın derinliklerindeki tehlikeli yolculuk...",
      backgroundColor: "#FFEBEE",
      textColor: "#C62828",
    },
    {
      id: 6,
      title: "Pamuk Prenses",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995596.png",
      author: "Grimm Kardeşler",
      category: "Masal",
      readTime: "1.5 saat",
      description: "Yedi cücelerle yaşayan prensesin hikayesi...",
      backgroundColor: "#E0F7FA",
      textColor: "#00838F",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.gridContainer}>
          {favorites.map((favorite) => (
            <TouchableOpacity
              key={favorite.id}
              style={[
                styles.card,
                {
                  width: CARD_WIDTH,
                  backgroundColor: favorite.backgroundColor,
                },
              ]}
            >
              <Image source={{ uri: favorite.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <View style={styles.titleContainer}>
                  <Text
                    style={[styles.cardTitle, { color: favorite.textColor }]}
                  >
                    {favorite.title}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.favoriteButton,
                      { backgroundColor: favorite.backgroundColor },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="heart"
                      size={20}
                      color={favorite.textColor}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={[styles.description, { color: favorite.textColor }]}
                  numberOfLines={2}
                >
                  {favorite.description}
                </Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="account"
                      size={14}
                      color={favorite.textColor}
                    />
                    <Text
                      style={[styles.infoText, { color: favorite.textColor }]}
                    >
                      {favorite.author}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="tag"
                      size={14}
                      color={favorite.textColor}
                    />
                    <Text
                      style={[styles.infoText, { color: favorite.textColor }]}
                    >
                      {favorite.category}
                    </Text>
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  <View style={styles.readTimeContainer}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={favorite.textColor}
                    />
                    <Text
                      style={[styles.readTime, { color: favorite.textColor }]}
                    >
                      {favorite.readTime}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.readButton,
                      { backgroundColor: favorite.textColor },
                    ]}
                    onPress={() =>
                      navigation.navigate("StoryDetail", { story: favorite })
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
  gridContainer: {
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
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  infoText: {
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
  removeButton: {
    padding: 8,
    borderRadius: 8,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
});
