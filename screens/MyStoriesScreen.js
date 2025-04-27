import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
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
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 sütun için hesaplama

// Renk paleti
const colorPalette = [
  { bg: "#E3F2FD", text: "#1976D2" }, // Mavi
  { bg: "#F3E5F5", text: "#7B1FA2" }, // Mor
  { bg: "#FFF3E0", text: "#E65100" }, // Turuncu
  { bg: "#E8F5E9", text: "#2E7D32" }, // Yeşil
  { bg: "#FFEBEE", text: "#C62828" }, // Kırmızı
  { bg: "#E0F7FA", text: "#00838F" }, // Turkuaz
  { bg: "#F5F5F5", text: "#424242" }, // Gri
  { bg: "#FFF8E1", text: "#FF8F00" }, // Amber
  { bg: "#E8EAF6", text: "#3949AB" }, // İndigo
  { bg: "#F1F8E9", text: "#689F38" }, // Açık Yeşil
];

export default function MyStoriesScreen() {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, archived
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    fetchStories();
  }, [filter, sortBy]);

  const fetchStories = async () => {
    try {
      const q = query(
        collection(db, "stories"),
        where("userId", "==", auth.currentUser?.uid)
      );
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

      // Filtreleme
      if (filter === "archived") {
        storiesList = storiesList.filter((story) => story.isArchived);
      }

      // Sıralama
      storiesList.sort((a, b) => {
        if (sortBy === "newest") {
          return b.createdAt - a.createdAt;
        } else if (sortBy === "oldest") {
          return a.createdAt - b.createdAt;
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });

      setStories(storiesList);
      setLoading(false);
    } catch (error) {
      console.error("Hikayeler yüklenirken hata:", error);
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    Alert.alert(
      "Hikayeyi Sil",
      "Bu hikayeyi silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "stories", storyId));
              fetchStories();
              Alert.alert("Başarılı", "Hikaye başarıyla silindi");
            } catch (error) {
              console.error("Hikaye silinirken hata:", error);
              Alert.alert("Hata", "Hikaye silinirken bir hata oluştu");
            }
          },
        },
      ]
    );
  };

  const handleArchiveStory = async (storyId, isArchived) => {
    try {
      await updateDoc(doc(db, "stories", storyId), {
        isArchived: !isArchived,
      });
      fetchStories();
      Alert.alert(
        "Başarılı",
        `Hikaye ${isArchived ? "arşivden çıkarıldı" : "arşivlendi"}`
      );
    } catch (error) {
      console.error("Hikaye arşivlenirken hata:", error);
      Alert.alert("Hata", "Hikaye arşivlenirken bir hata oluştu");
    }
  };

  const handleFavoriteStory = async (storyId, isFavorite) => {
    try {
      await updateDoc(doc(db, "stories", storyId), {
        isFavorite: !isFavorite,
      });
      fetchStories();
    } catch (error) {
      console.error("Hikaye favorilere eklenirken hata:", error);
      Alert.alert("Hata", "Hikaye favorilere eklenirken bir hata oluştu");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Hikayelerim</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "all" && styles.activeFilter,
              ]}
              onPress={() => setFilter("all")}
            >
              <Text style={styles.filterText}>Tümü</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "archived" && styles.activeFilter,
              ]}
              onPress={() => setFilter("archived")}
            >
              <Text style={styles.filterText}>Arşiv</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                sortBy === "newest" && styles.activeFilter,
              ]}
              onPress={() => setSortBy("newest")}
            >
              <Text style={styles.filterText}>Yeni</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                sortBy === "oldest" && styles.activeFilter,
              ]}
              onPress={() => setSortBy("oldest")}
            >
              <Text style={styles.filterText}>Eski</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                sortBy === "title" && styles.activeFilter,
              ]}
              onPress={() => setSortBy("title")}
            >
              <Text style={styles.filterText}>Başlık</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        ) : stories.length === 0 ? (
          <Text style={styles.emptyText}>Henüz hikaye oluşturmadınız</Text>
        ) : (
          <View style={styles.gridContainer}>
            {stories.map((story) => (
              <View
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
                    {story.content?.substring(0, 100)}...
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
                          styles.actionButton,
                          { backgroundColor: story.textColor },
                        ]}
                        onPress={() =>
                          handleFavoriteStory(story.id, story.isFavorite)
                        }
                      >
                        <MaterialCommunityIcons
                          name={story.isFavorite ? "heart" : "heart-outline"}
                          size={12}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: story.textColor },
                        ]}
                        onPress={() =>
                          handleArchiveStory(story.id, story.isArchived)
                        }
                      >
                        <MaterialCommunityIcons
                          name={
                            story.isArchived ? "archive" : "archive-outline"
                          }
                          size={12}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: story.textColor },
                        ]}
                        onPress={() =>
                          navigation.navigate("EditStory", { story })
                        }
                      >
                        <MaterialCommunityIcons
                          name="pencil"
                          size={12}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: story.textColor },
                        ]}
                        onPress={() => handleDeleteStory(story.id)}
                      >
                        <MaterialCommunityIcons
                          name="delete"
                          size={12}
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
              </View>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  filterContainer: {
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  activeFilter: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  sortContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
  },
  sortButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  activeSort: {
    backgroundColor: "#4CAF50",
  },
  sortText: {
    color: "#fff",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
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
    padding: 12,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "100%",
    justifyContent: "center",
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  readButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readButtonText: {
    color: "#fff",
    fontSize: 10,
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
