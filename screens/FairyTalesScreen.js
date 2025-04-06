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

export default function FairyTalesScreen() {
  const navigation = useNavigation();
  const fairyTales = [
    {
      id: 1,
      title: "Küçük Prens",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995591.png",
      readTime: "2 saat",
      category: "Klasik",
      author: "Antoine de Saint-Exupéry",
      description:
        "Küçük bir prensin gezegenler arası yolculuğu ve hayatın anlamını arayışı...",
      backgroundColor: "#E3F2FD",
      textColor: "#1976D2",
    },
    {
      id: 2,
      title: "Alice Harikalar Diyarında",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995592.png",
      readTime: "1.5 saat",
      category: "Fantastik",
      author: "Lewis Carroll",
      description:
        "Alice'in tavşan deliğinden geçerek başlayan büyülü macerası...",
      backgroundColor: "#F3E5F5",
      textColor: "#7B1FA2",
    },
    {
      id: 3,
      title: "Pinokyo",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995593.png",
      readTime: "2.5 saat",
      category: "Macera",
      author: "Carlo Collodi",
      description:
        "Tahta kukladan gerçek bir çocuğa dönüşen Pinokyo'nun hikayesi...",
      backgroundColor: "#FFF3E0",
      textColor: "#E65100",
    },
    {
      id: 4,
      title: "Peter Pan",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995594.png",
      readTime: "2 saat",
      category: "Fantastik",
      author: "J.M. Barrie",
      description: "Hiç büyümeyen çocuğun Neverland'deki maceraları...",
      backgroundColor: "#E8F5E9",
      textColor: "#2E7D32",
    },
    {
      id: 5,
      title: "Kırmızı Başlıklı Kız",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995595.png",
      readTime: "1 saat",
      category: "Masal",
      author: "Grimm Kardeşler",
      description: "Ormanın derinliklerindeki tehlikeli yolculuk...",
      backgroundColor: "#FFEBEE",
      textColor: "#C62828",
    },
    {
      id: 6,
      title: "Pamuk Prenses",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995596.png",
      readTime: "1.5 saat",
      category: "Masal",
      author: "Grimm Kardeşler",
      description: "Yedi cücelerle yaşayan prensesin hikayesi...",
      backgroundColor: "#E0F7FA",
      textColor: "#00838F",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Masal Dünyası</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.gridContainer}>
          {fairyTales.map((tale) => (
            <TouchableOpacity
              key={tale.id}
              style={[
                styles.card,
                { width: CARD_WIDTH, backgroundColor: tale.backgroundColor },
              ]}
            >
              <Image source={{ uri: tale.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: tale.textColor }]}>
                  {tale.title}
                </Text>
                <Text
                  style={[styles.description, { color: tale.textColor }]}
                  numberOfLines={2}
                >
                  {tale.description}
                </Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="account"
                      size={14}
                      color={tale.textColor}
                    />
                    <Text style={[styles.infoText, { color: tale.textColor }]}>
                      {tale.author}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="tag"
                      size={14}
                      color={tale.textColor}
                    />
                    <Text style={[styles.infoText, { color: tale.textColor }]}>
                      {tale.category}
                    </Text>
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  <View style={styles.readTimeContainer}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={tale.textColor}
                    />
                    <Text style={[styles.readTime, { color: tale.textColor }]}>
                      {tale.readTime}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.readButton,
                      { backgroundColor: tale.textColor },
                    ]}
                    onPress={() =>
                      navigation.navigate("StoryDetail", { story: tale })
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
});
