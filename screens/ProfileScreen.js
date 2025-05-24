import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../config/firebase";
import { signOut, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    totalDrawings: 0,
    favoriteStories: 0,
    lastActivity: null,
  });
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "tr",
  });

  const profileItems = [
    {
      id: 1,
      title: "Yardım & Destek",
      icon: "help-circle",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
      screen: "HelpSupport",
    },
    {
      id: 2,
      title: "Hakkında",
      icon: "information",
      color: "#9C27B0",
      backgroundColor: "#F3E5F5",
      screen: "About",
    },
    {
      id: 3,
      title: "Ebeveyn Kontrolü",
      icon: "shield-account",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
      screen: "ParentalControl",
    },
    {
      id: 4,
      title: "Gizlilik",
      icon: "lock",
      color: "#F44336",
      backgroundColor: "#FFEBEE",
      screen: "Privacy",
    },
    {
      id: 5,
      title: "Ayarlar",
      icon: "cog",
      color: "#607D8B",
      backgroundColor: "#ECEFF1",
      screen: "Settings",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("Firestore'dan gelen kullanıcı verisi:", data); // Debug için
            setUserData(data);
          } else {
            console.log("Kullanıcı dokümanı bulunamadı"); // Debug için
          }
        } else {
          console.log("Giriş yapmış kullanıcı bulunamadı"); // Debug için
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    loadUserStories();
  }, []);

  const loadUserStories = async () => {
    try {
      const db = getFirestore();
      const storiesQuery = query(
        collection(db, "stories"),
        where("userId", "==", getAuth().currentUser.uid)
      );

      const storiesSnapshot = await getDocs(storiesQuery);
      const storiesList = storiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStories(storiesList);
      setStats({
        totalStories: storiesList.length,
        totalDrawings: storiesList.filter((story) => story.drawing).length,
        favoriteStories: storiesList.filter((story) => story.isFavorite).length,
        lastActivity:
          storiesList.length > 0
            ? new Date(
                Math.max(...storiesList.map((s) => s.updatedAt?.toDate() || 0))
              ).toLocaleDateString("tr-TR")
            : "Henüz aktivite yok",
      });
    } catch (error) {
      console.error("Hikayeler yüklenirken hata:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (email !== auth.currentUser?.email) {
        await updateEmail(auth.currentUser, email);
      }
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }
      Alert.alert("Başarılı", "Bilgileriniz güncellendi");
      setIsEditing(false);
      setPassword("");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  if (loading) {
    return (
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/1995/1995577.png",
                  }}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editAvatarButton}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileRight}>
              <View style={styles.usernameContainer}>
                <Text style={styles.username}>
                  {userData?.username || "Kullanıcı"}
                </Text>
                <TouchableOpacity style={styles.editInfoButton}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={16}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.credentialsContainer}>
                <View style={styles.credentialItem}>
                  <MaterialCommunityIcons name="email" size={16} color="#fff" />
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="E-posta"
                      placeholderTextColor="#E8F5E9"
                    />
                  ) : (
                    <Text style={styles.credentialText}>{email}</Text>
                  )}
                </View>
                {isEditing && (
                  <>
                    <View style={styles.credentialItem}>
                      <MaterialCommunityIcons
                        name="lock"
                        size={16}
                        color="#fff"
                      />
                      <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mevcut Şifre"
                        placeholderTextColor="#E8F5E9"
                        secureTextEntry
                      />
                    </View>
                    <View style={styles.credentialItem}>
                      <MaterialCommunityIcons
                        name="lock"
                        size={16}
                        color="#fff"
                      />
                      <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Yeni Şifre"
                        placeholderTextColor="#E8F5E9"
                        secureTextEntry
                      />
                    </View>
                  </>
                )}
              </View>
              {isEditing ? (
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdate}
                  >
                    <Text style={styles.buttonText}>Kaydet</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsEditing(false);
                      setPassword("");
                      setNewPassword("");
                    }}
                  >
                    <Text style={styles.buttonText}>İptal</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.editButtonText}>Bilgileri Düzenle</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>Hakkımda</Text>
            <Text style={styles.aboutText}>
              Hayal Dünyam'da eğlenceli hikayeler okuyorum ve oyunlar oynuyorum!
            </Text>
            <TouchableOpacity style={styles.editAboutButton}>
              <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İstatistiklerim</Text>
            <View style={styles.horizontalScroll}>
              <View style={[styles.smallCard, { backgroundColor: "#E8F5E9" }]}>
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons
                    name="book"
                    size={14}
                    color="#4CAF50"
                  />
                  <Text style={[styles.smallCardValue, { color: "#4CAF50" }]}>
                    {stats.totalStories}
                  </Text>
                </View>
                <Text style={[styles.smallCardTitle, { color: "#4CAF50" }]}>
                  Hikayeler
                </Text>
              </View>
              <View style={[styles.smallCard, { backgroundColor: "#E3F2FD" }]}>
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons
                    name="draw"
                    size={14}
                    color="#2196F3"
                  />
                  <Text style={[styles.smallCardValue, { color: "#2196F3" }]}>
                    {stats.totalDrawings}
                  </Text>
                </View>
                <Text style={[styles.smallCardTitle, { color: "#2196F3" }]}>
                  Çizimler
                </Text>
              </View>
              <View style={[styles.smallCard, { backgroundColor: "#FFF3E0" }]}>
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color="#FF9800"
                  />
                  <Text style={[styles.smallCardValue, { color: "#FF9800" }]}>
                    {stats.favoriteStories}
                  </Text>
                </View>
                <Text style={[styles.smallCardTitle, { color: "#FF9800" }]}>
                  Favoriler
                </Text>
              </View>
            </View>
            <Text style={styles.lastActivityText}>
              Son Aktivite: {stats.lastActivity}
            </Text>
          </View>

          <View style={styles.profileItems}>
            {profileItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.profileItem,
                  { backgroundColor: item.backgroundColor },
                ]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.profileItemContent}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={30}
                    color={item.color}
                  />
                  <Text style={[styles.profileItemText, { color: item.color }]}>
                    {item.title}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={item.color}
                />
              </TouchableOpacity>
            ))}
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  profileSection: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileLeft: {
    marginRight: 15,
  },
  profileRight: {
    flex: 1,
    justifyContent: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  editInfoButton: {
    marginLeft: 8,
  },
  aboutSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    width: "100%",
    position: "relative",
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 12,
    color: "#E8F5E9",
    lineHeight: 16,
  },
  editAboutButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 12,
    color: "#E8F5E9",
  },
  section: {
    padding: 4,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    marginLeft: 0,
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingVertical: 1,
    justifyContent: "space-between",
  },
  smallCard: {
    width: 95,
    height: 40,
    padding: 2,
    borderRadius: 8,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  smallCardValue: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  smallCardTitle: {
    fontSize: 8,
    textAlign: "center",
  },
  profileItems: {
    padding: 10,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileItemText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  signOutButton: {
    padding: 8,
    marginLeft: 8,
  },
  credentialsContainer: {
    marginTop: 10,
  },
  credentialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  credentialText: {
    fontSize: 12,
    color: "#E8F5E9",
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "#fff",
    marginLeft: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  editButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 10,
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  lastActivityText: {
    fontSize: 12,
    color: "#E8F5E9",
    marginTop: 8,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
});
