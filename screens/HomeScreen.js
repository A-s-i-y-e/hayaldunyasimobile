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
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  const menuItems = [
    {
      title: "Çizim Yap",
      icon: "pencil",
      color: "#4CAF50",
      screen: "Draw",
      description: "Hayallerini çizime dök",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    },
    {
      title: "Hikayeler",
      icon: "book-open-variant",
      color: "#66BB6A",
      screen: "Stories",
      description: "Büyülü hikayeler oku",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995575.png",
    },
    {
      title: "Oyunlar",
      icon: "gamepad-variant",
      color: "#81C784",
      screen: "Games",
      description: "Eğlenceli oyunlar oyna",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995576.png",
    },
    {
      title: "Profilim",
      icon: "account",
      color: "#A5D6A7",
      screen: "Profile",
      description: "Profilini düzenle",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995577.png",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="tree" size={40} color="#fff" />
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>🌳 Masal Ormanı</Text>
          <Text style={styles.subtitleText}>
            Büyülü ormanın kapıları açılıyor...
          </Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemContent}>
                <Image source={{ uri: item.image }} style={styles.menuImage} />
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Ormanın Sırları</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredScroll}
          >
            {[
              {
                title: "Peri Bahçesi",
                description: "Renkli çiçekler ve büyülü yaratıklar",
                image:
                  "https://cdn-icons-png.flaticon.com/512/1995/1995581.png",
              },
              {
                title: "Elf Köyü",
                description: "Küçük evler ve dost canlısı elfler",
                image:
                  "https://cdn-icons-png.flaticon.com/512/1995/1995582.png",
              },
              {
                title: "Büyücü Kulesi",
                description: "Sihirli kitaplar ve gizemli formüller",
                image:
                  "https://cdn-icons-png.flaticon.com/512/1995/1995583.png",
              },
            ].map((item, index) => (
              <View key={index} style={styles.featuredCard}>
                <View style={styles.featuredImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.featuredImage}
                  />
                </View>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
          </ScrollView>
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: "#E8F5E9",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
  },
  menuItem: {
    width: (width - 40) / 2,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  menuItemContent: {
    alignItems: "center",
  },
  menuImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  menuText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  menuDescription: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
  },
  featuredSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredScroll: {
    flexDirection: "row",
  },
  featuredCard: {
    width: width * 0.7,
    marginRight: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuredImageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 14,
    color: "#666",
  },
});
