import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
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
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, db } from "../config/firebase";

const { width } = Dimensions.get("window");

export default function StoriesScreen() {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);
  const [createdStoriesCount, setCreatedStoriesCount] = useState(0);
  const [readStoriesCount, setReadStoriesCount] = useState(0);
  const [readStories, setReadStories] = useState([]);

  const userStats = {
    createdStories: 3,
    favoriteStories: 8,
  };

  const storyItems = [
    {
      id: 1,
      title: "Hikayelerim",
      description: "Oluşturduğun hikayeleri görüntüle",
      icon: "book-account",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
      screen: "MyStories",
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

  useEffect(() => {
    fetchStories();
    fetchUserData();
  }, []);

  const fetchStories = async () => {
    try {
      const q = query(
        collection(db, "stories"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const storiesList = [];
      let totalLikesCount = 0;

      querySnapshot.forEach((doc) => {
        const storyData = { id: doc.id, ...doc.data() };
        storiesList.push(storyData);
        totalLikesCount += storyData.likes || 0;
      });

      setStories(storiesList);
      setTotalLikes(totalLikesCount);
      setCreatedStoriesCount(storiesList.length);
      setLoading(false);
    } catch (error) {
      console.error("Hikayeler yüklenirken hata:", error);
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser?.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserData(userData);
        setReadStories(userData.readStories || []);
        setReadStoriesCount(userData.readStories?.length || 0);
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    }
  };

  const handleRead = async (storyId) => {
    if (!auth.currentUser || readStories.includes(storyId)) return;

    try {
      // Hikayenin okuma sayısını artır
      const storyRef = doc(db, "stories", storyId);
      await updateDoc(storyRef, {
        readBy: arrayUnion(auth.currentUser.uid),
        readCount: increment(1),
      });

      // Kullanıcının okuma sayısını güncelle
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        readStories: arrayUnion(storyId),
      });

      // Local state'i güncelle
      setReadStories((prev) => [...prev, storyId]);
      setReadStoriesCount((prev) => prev + 1);

      // Kullanıcı verilerini yeniden yükle
      fetchUserData();
    } catch (error) {
      console.error("Okuma işlemi sırasında hata:", error);
    }
  };

  const renderStoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => navigation.navigate("StoryDetail", { story: item })}
    >
      <View style={styles.storyContent}>
        {item.drawing ? (
          <Image
            source={{
              uri: item.drawing.imageData.startsWith("data:image")
                ? item.drawing.imageData
                : `data:image/png;base64,${item.drawing.imageData}`,
            }}
            style={styles.storyImage}
            resizeMode="cover"
          />
        ) : (
          <MaterialCommunityIcons
            name="book-open-variant"
            size={24}
            color="#4CAF50"
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.storyTitle}>{item.title}</Text>
          <Text style={styles.storyDescription}>Yazar: {item.author}</Text>
          <View style={styles.likesContainer}>
            <MaterialCommunityIcons
              name="heart"
              size={16}
              color="#4CAF50"
              style={styles.likeIcon}
            />
            <Text style={styles.likesCount}>{item.likes || 0}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => handleRead(item.id)}
        >
          <Text style={styles.readButtonText}>
            {readStories.includes(item.id) ? "Okundu" : "Oku"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
              <Text style={styles.username}>
                {userData?.username || "Kullanıcı"}
              </Text>
              <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={24}
                color="#fff"
              />
              <Text style={styles.statValue}>{readStoriesCount}</Text>
              <Text style={styles.statLabel}>Okunan</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
              <Text style={styles.statValue}>{createdStoriesCount}</Text>
              <Text style={styles.statLabel}>Oluşturulan</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="heart" size={24} color="#fff" />
              <Text style={styles.statValue}>{totalLikes}</Text>
              <Text style={styles.statLabel}>Toplam Beğeni</Text>
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
  storyImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsButton: {
    padding: 5,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  likeIcon: {
    marginRight: 5,
  },
  likesCount: {
    color: "#4CAF50",
    fontSize: 14,
  },
  readButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginLeft: 10,
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});
