import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

const gameItems = [
  {
    id: 1,
    title: "Kelime Avı",
    icon: "format-text",
    color: "#fff",
    backgroundColor: "#4CAF50",
    screen: "WordSearch",
    description: "Kelime bulmaca oyunu",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995578.png",
    difficulty: "Kolay",
    players: "1 Oyuncu",
  },
  {
    id: 2,
    title: "Hafıza Oyunu",
    icon: "cards",
    color: "#fff",
    backgroundColor: "#2196F3",
    screen: "MemoryGame",
    description: "Eşleştirme oyunu",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995579.png",
    difficulty: "Orta",
    players: "1-2 Oyuncu",
  },
  {
    id: 3,
    title: "Sayı Oyunu",
    icon: "numeric",
    color: "#fff",
    backgroundColor: "#FF9800",
    screen: "NumberGame",
    description: "Matematik oyunu",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995580.png",
    difficulty: "Zor",
    players: "1 Oyuncu",
  },
  {
    id: 4,
    title: "Yapboz",
    icon: "puzzle",
    color: "#fff",
    backgroundColor: "#9C27B0",
    screen: "Puzzle",
    description: "Resim tamamlama",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995581.png",
    difficulty: "Orta",
    players: "1 Oyuncu",
  },
];

export default function GamesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleGamePress = (screen) => {
    console.log("Navigating to:", screen);
    navigation.navigate(screen);
  };

  const filteredGames = gameItems.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Oyunlar</Text>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={16} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Oyun ara..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.gamesList}>
          {filteredGames.map((game) => (
            <View
              key={game.id}
              style={[
                styles.gameCard,
                { backgroundColor: game.backgroundColor },
              ]}
            >
              <View style={styles.gameImageContainer}>
                <Image source={{ uri: game.image }} style={styles.gameImage} />
              </View>
              <View style={styles.gameInfo}>
                <Text style={[styles.gameTitle, { color: game.color }]}>
                  {game.title}
                </Text>
                <MaterialCommunityIcons
                  name={game.icon}
                  size={32}
                  color={game.color}
                  style={styles.gameIcon}
                />
                <View style={styles.buttonsContainer}>
                  <View style={styles.buttonRow}>
                    <View
                      style={[
                        styles.detailItem,
                        { backgroundColor: "rgba(255,255,255,0.2)" },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="account-group"
                        size={16}
                        color={game.color}
                      />
                      <Text style={[styles.detailText, { color: game.color }]}>
                        {game.players}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonRow}>
                    <View
                      style={[
                        styles.detailItem,
                        { backgroundColor: "rgba(255,255,255,0.2)" },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color={game.color}
                      />
                      <Text style={[styles.detailText, { color: game.color }]}>
                        {game.difficulty}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[
                        styles.playButton,
                        { backgroundColor: "rgba(255,255,255,0.3)" },
                      ]}
                      onPress={() => handleGamePress(game.screen)}
                    >
                      <MaterialCommunityIcons
                        name="play"
                        size={20}
                        color={game.color}
                      />
                      <Text
                        style={[styles.playButtonText, { color: game.color }]}
                      >
                        Oyna
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    height: 40,
    textAlignVertical: "center",
    lineHeight: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 220,
    height: 40,
  },
  searchInput: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    flex: 1,
    height: 40,
    textAlignVertical: "center",
    paddingVertical: 0,
  },
  searchButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  gamesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "space-between",
  },
  gameCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
  },
  gameImageContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  gameInfo: {
    padding: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  gameIcon: {
    marginBottom: 0,
    textAlign: "center",
  },
  gameDescription: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: 8,
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    height: 32,
    width: 120,
    justifyContent: "center",
  },
  detailText: {
    fontSize: 10,
    marginLeft: 4,
  },
  playButton: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    width: 120,
    height: 32,
  },
  playButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
});
