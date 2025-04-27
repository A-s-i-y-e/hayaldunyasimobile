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
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");

export default function StoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    if (!route.params?.story) {
      setLoading(false);
      return;
    }

    const initialStory = route.params.story;
    console.log("Initial story:", initialStory);

    // Eğer hikaye Firebase'den gelmiyorsa (masal dünyasındaki hikayeler gibi)
    if (!initialStory.id) {
      setStory(initialStory);
      setIsLiked(false);
      setIsRead(false);
      setLoading(false);
      return;
    }

    setStory(initialStory);
    setIsLiked(
      Array.isArray(initialStory.likedBy) &&
        initialStory.likedBy.includes(auth.currentUser?.uid)
    );
    setIsRead(
      Array.isArray(initialStory.readBy) &&
        initialStory.readBy.includes(auth.currentUser?.uid)
    );
    setLoading(false);

    // Sadece Firebase'den gelen hikayeler için gerçek zamanlı dinleme
    const storyRef = doc(db, "stories", initialStory.id);
    const unsubscribe = onSnapshot(storyRef, (doc) => {
      if (doc.exists()) {
        const updatedStory = { id: doc.id, ...doc.data() };
        setStory(updatedStory);
        setIsLiked(
          Array.isArray(updatedStory.likedBy) &&
            updatedStory.likedBy.includes(auth.currentUser?.uid)
        );
        setIsRead(
          Array.isArray(updatedStory.readBy) &&
            updatedStory.readBy.includes(auth.currentUser?.uid)
        );
      }
    });

    // Hikayeye girildiğinde otomatik olarak okundu say
    handleRead();

    return () => unsubscribe();
  }, [route.params?.story]);

  const handleRead = async () => {
    if (!story || !auth.currentUser || isRead) return;

    // Eğer hikaye Firebase'den gelmiyorsa (masal dünyasındaki hikayeler gibi)
    if (!story.id) {
      setIsRead(true);
      return;
    }

    try {
      const storyRef = doc(db, "stories", story.id);
      await updateDoc(storyRef, {
        readBy: arrayUnion(auth.currentUser.uid),
        readCount: increment(1),
      });

      // Kullanıcının okuma sayısını güncelle
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        readStories: arrayUnion(story.id),
      });

      setIsRead(true);
    } catch (error) {
      console.error("Okuma işlemi sırasında hata:", error);
    }
  };

  const handleLike = async () => {
    if (!story || !auth.currentUser) return;

    // Eğer hikaye Firebase'den gelmiyorsa (masal dünyasındaki hikayeler gibi)
    if (!story.id) {
      setIsLiked(!isLiked);
      return;
    }

    try {
      const storyRef = doc(db, "stories", story.id);
      const newLikedBy = isLiked
        ? arrayRemove(auth.currentUser.uid)
        : arrayUnion(auth.currentUser.uid);

      await updateDoc(storyRef, {
        likedBy: newLikedBy,
        likes: isLiked ? (story.likes || 1) - 1 : (story.likes || 0) + 1,
      });
    } catch (error) {
      console.error("Beğeni işlemi sırasında hata:", error);
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

  if (loading) {
    return (
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!story) {
    return (
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Hikaye Bulunamadı</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{story.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[
            styles.storyContainer,
            { backgroundColor: story.backgroundColor || "#fff" },
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
                color={story.textColor || "#000"}
              />
            </View>
          )}

          <View style={styles.storyContent}>
            <Text
              style={[styles.storyTitle, { color: story.textColor || "#000" }]}
            >
              {story.title}
            </Text>
            <Text
              style={[styles.description, { color: story.textColor || "#000" }]}
            >
              {story.description}
            </Text>
            <View style={styles.contentContainer}>
              <Text
                style={[
                  styles.contentText,
                  { color: story.textColor || "#000" },
                ]}
              >
                {story.content}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="account"
                size={14}
                color={story.textColor || "#000"}
              />
              <Text
                style={[styles.infoText, { color: story.textColor || "#000" }]}
              >
                {story.author}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="tag"
                size={14}
                color={story.textColor || "#000"}
              />
              <Text
                style={[styles.infoText, { color: story.textColor || "#000" }]}
              >
                {story.category}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.infoItem, styles.likeButton]}
              onPress={handleLike}
            >
              <MaterialCommunityIcons
                name={isLiked ? "star" : "star-outline"}
                size={14}
                color={isLiked ? "#FFD700" : story.textColor || "#000"}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: isLiked ? "#FFD700" : story.textColor || "#000" },
                ]}
              >
                {story.likes || 0}
              </Text>
            </TouchableOpacity>
          </View>

          {!isRead && (
            <TouchableOpacity style={styles.readButton} onPress={handleRead}>
              <Text style={styles.readButtonText}>Okudum</Text>
            </TouchableOpacity>
          )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  storyContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 200,
  },
  placeholderImage: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  storyContent: {
    padding: 20,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    fontStyle: "italic",
  },
  contentContainer: {
    marginTop: 15,
    paddingHorizontal: 5,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  infoContainer: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 5,
  },
  likeButton: {
    marginLeft: "auto",
  },
  readButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  readButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
