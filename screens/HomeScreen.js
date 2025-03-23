import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hayal Dünyası</Text>
        {user && (
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>✨ Hayal Dünyasına Hoş Geldiniz</Text>
          <Text style={styles.subTitle}>
            Hayallerinizin büyülü ormanında maceraya hazır mısınız? 🌿
          </Text>

          {!user ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>🌟 Giriş Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.buttonText}>🌱 Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Draw")}
              >
                <Text style={styles.buttonText}>🎨 Çizim Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Stories")}
              >
                <Text style={styles.buttonText}>📖 Hikayeler</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Draw")}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>🎨</Text>
              </View>
              <Text style={styles.cardTitle}>Çizim Yap</Text>
              <Text style={styles.cardDescription}>
                Hayallerinizi çizime dökün
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Stories")}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>📖</Text>
              </View>
              <Text style={styles.cardTitle}>Hikayeler</Text>
              <Text style={styles.cardDescription}>
                Büyülü hikayeler oluşturun
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Games")}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>🎮</Text>
              </View>
              <Text style={styles.cardTitle}>Oyunlar</Text>
              <Text style={styles.cardDescription}>
                Eğlenceli oyunlar oynayın
              </Text>
            </TouchableOpacity>
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
    padding: 20,
    paddingTop: 40,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subTitle: {
    fontSize: 18,
    color: "#E8F5E9",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
  },
  secondaryButton: {
    backgroundColor: "#66BB6A",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    gap: 20,
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#E8F5E9",
    textAlign: "center",
  },
});
