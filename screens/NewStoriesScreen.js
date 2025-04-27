import React, { useState, useEffect } from "react";
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
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

// Renk paleti
const colorPalette = [
  { bg: "#E3F2FD", text: "#1976D2" },
  { bg: "#F3E5F5", text: "#7B1FA2" },
  { bg: "#FFF3E0", text: "#E65100" },
  { bg: "#E8F5E9", text: "#2E7D32" },
  { bg: "#FFEBEE", text: "#C62828" },
  { bg: "#E0F7FA", text: "#00838F" },
  { bg: "#F5F5F5", text: "#424242" },
  { bg: "#FFF8E1", text: "#FF8F00" },
  { bg: "#E8EAF6", text: "#3949AB" },
  { bg: "#F1F8E9", text: "#689F38" },
];

export default function NewStoriesScreen() {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    fetchStories();
    fetchFavorites();
  }, []);

  const fetchStories = async () => {
    try {
      const q = query(collection(db, "stories"));
      const querySnapshot = await getDocs(q);
      let storiesList = [];

      querySnapshot.forEach((doc) => {
        const randomColor =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        storiesList.push({
          id: doc.id,
          ...doc.data(),
          backgroundColor: randomColor.bg,
          textColor: randomColor.text,
        });
      });

      // En yeni hikayeler önce gelecek şekilde sırala
      storiesList.sort((a, b) => b.createdAt - a.createdAt);

      setStories(storiesList);
      setLoading(false);
    } catch (error) {
      console.error("Hikayeler yüklenirken hata:", error);
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      if (!auth.currentUser) return;

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFavorites(userData.favorites || []);
      }
    } catch (error) {
      console.error("Favoriler yüklenirken hata:", error);
    }
  };

  const toggleFavorite = async (storyId) => {
    try {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const isFavorite = favorites.includes(storyId);

      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(storyId),
        });
        setFavorites(favorites.filter((id) => id !== storyId));
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(storyId),
        });
        setFavorites([...favorites, storyId]);
      }
    } catch (error) {
      console.error("Favori işlemi sırasında hata:", error);
    }
  };

  const getImageSource = (imageData) => {
    if (!imageData) return null;
    if (imageData.startsWith("data:image")) {
      return { uri: imageData };
    } else if (imageData.startsWith("http")) {
      return { uri: imageData };
    } else {
      return { uri: `data:image/png;base64,${imageData.replace(/\n/g, "")}` };
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yeni Hikayeler</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        ) : stories.length === 0 ? (
          <Text style={styles.emptyText}>Henüz hikaye bulunmuyor</Text>
        ) : (
          <View style={styles.storiesGrid}>
            {stories.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={[
                  styles.card,
                  { width: CARD_WIDTH, backgroundColor: story.backgroundColor },
                ]}
              >
                {story.drawing?.imageData ? (
                  <Image
                    source={getImageSource(story.drawing.imageData)}
                    style={styles.image}
                  />
                ) : (
                  <View style={[styles.image, styles.placeholderImage]}>
                    <MaterialCommunityIcons
                      name="book-open-variant"
                      size={40}
                      color={story.textColor}
                    />
                  </View>
                )}
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
                      <Text
                        style={[styles.infoText, { color: story.textColor }]}
                      >
                        {story.author}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons
                        name="tag"
                        size={14}
                        color={story.textColor}
                      />
                      <Text
                        style={[styles.infoText, { color: story.textColor }]}
                      >
                        {story.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bottomContainer}>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.favoriteButton,
                          { backgroundColor: story.textColor },
                        ]}
                        onPress={() => toggleFavorite(story.id)}
                      >
                        <MaterialCommunityIcons
                          name={
                            favorites.includes(story.id)
                              ? "heart"
                              : "heart-outline"
                          }
                          size={16}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.readButton,
                          { backgroundColor: story.textColor },
                        ]}
                        onPress={() =>
                          navigation.navigate("StoryDetail", { story })
                        }
                      >
                        <Text style={styles.readButtonText}>Oku</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  placeholderImage: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  readButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  readButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
