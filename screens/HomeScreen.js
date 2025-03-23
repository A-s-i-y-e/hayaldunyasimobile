import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✨ Hayal Dünyası</Text>
          <View style={styles.headerMenu}>
            <TouchableOpacity onPress={() => navigation.navigate("Draw")}>
              <Text style={styles.headerMenuItem}>🎨 Çizim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Stories")}>
              <Text style={styles.headerMenuItem}>📚 Hikayeler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.headerMenuItem}>👤 Profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>Hayal Dünyası Büyülü Ormanı</Text>
          <Text style={styles.subTitle}>
            Hayallerinizin büyülü ormanında maceraya hazır mısınız? 🌿
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.buttonText}>🌱 Hayallerine Başla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>🌟 Hayal Dünyası Katıl</Text>
            </TouchableOpacity>
          </View>

          {/* Feature Cards */}
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Draw")}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>🎨</Text>
              </View>
              <Text style={styles.cardTitle}>Hayal Et ve Çiz</Text>
              <Text style={styles.cardDescription}>
                Hayallerini renkli çizimlerle hayata geçir!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Stories")}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>📚</Text>
              </View>
              <Text style={styles.cardTitle}>Hayal Hikayeleri</Text>
              <Text style={styles.cardDescription}>
                Özgün hayal yeri bir hikaye dünyası yeni bir macera!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Games")}
            >
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>🎮</Text>
              </View>
              <Text style={styles.cardTitle}>Hayal oyunları</Text>
              <Text style={styles.cardDescription}>
                Hayallerini oyunlarla keşfedin!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    minHeight: "100%",
    width: "100%",
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerMenu: {
    flexDirection: "row",
    gap: 20,
  },
  headerMenuItem: {
    color: "#fff",
    fontSize: 16,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
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
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    minWidth: 180,
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
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    gap: 15,
    padding: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "30%",
    minWidth: 150,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    margin: 5,
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
