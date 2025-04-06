import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const PUZZLE_IMAGES = [
  {
    id: 1,
    name: "Hayvanlar",
    images: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🦁",
      "🐯",
      "🦒",
      "🦘",
    ],
  },
  {
    id: 2,
    name: "Meyveler",
    images: [
      "🍎",
      "🍌",
      "🍇",
      "🍊",
      "🍓",
      "🍉",
      "🍐",
      "🍒",
      "🍑",
      "🥝",
      "🥭",
      "🍍",
    ],
  },
  {
    id: 3,
    name: "Taşıtlar",
    images: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚜",
      "🚲",
      "🛵",
    ],
  },
  {
    id: 4,
    name: "Spor",
    images: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "🏒",
      "🏏",
    ],
  },
];

export default function MemoryGameScreen() {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [foundPairs, setFoundPairs] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [cardCount, setCardCount] = useState(4);
  const [completedGames, setCompletedGames] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * PUZZLE_IMAGES.length);
    return PUZZLE_IMAGES[randomIndex];
  };

  const initializeGame = () => {
    const theme = getRandomTheme();
    setCurrentTheme(theme);

    const selectedImages = theme.images.slice(0, cardCount / 2);
    const gameCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(gameCards);
    setMoves(0);
    setFlippedCards([]);
    setFoundPairs([]);
    setIsChecking(false);
  };

  const handleCardPress = (index) => {
    if (
      flippedCards.length < 2 &&
      !cards[index].isFlipped &&
      !cards[index].isMatched
    ) {
      const newCards = cards.map((c) =>
        c.id === index ? { ...c, isFlipped: true } : c
      );
      setCards(newCards);
      setFlippedCards([...flippedCards, cards[index]]);

      if (flippedCards.length === 1) {
        setMoves(moves + 1);
        const [firstCard] = flippedCards;
        if (firstCard.image === cards[index].image) {
          const matchedCards = newCards.map((c) =>
            c.image === cards[index].image ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setScore(score + 10);
          setFlippedCards([]);
          setFoundPairs([...foundPairs, cards[index].image]);

          // Tüm kartlar eşleşti mi kontrol et
          const allMatched = matchedCards.every((card) => card.isMatched);
          if (allMatched) {
            setCompletedGames(completedGames + 1);
            if (completedGames % 2 === 0 && cardCount < 20) {
              setCardCount(cardCount + 2);
            }
            Alert.alert(
              "Tebrikler!",
              `Yapbozu tamamladınız!\nPuan: ${score + 10}\nYeni oyunda ${
                cardCount + 2
              } kart olacak!`
            );
            setTimeout(() => {
              initializeGame();
            }, 1500);
          }
        } else {
          setTimeout(() => {
            const resetCards = newCards.map((c) =>
              c.id === firstCard.id || c.id === index
                ? { ...c, isFlipped: false }
                : c
            );
            setCards(resetCards);
            setFlippedCards([]);
          }, 1000);
        }
      }
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  const startNewGame = () => {
    setScore(0);
    setCardCount(4);
    setCompletedGames(0);
    initializeGame();
  };

  return (
    <LinearGradient colors={["#2C3E50", "#3498DB"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hafıza Oyunu</Text>
        <Text style={styles.score}>Puan: {score}</Text>
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.themeName}>{currentTheme?.name}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={startNewGame}>
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.buttonText}>Yeni Oyun</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                card.isFlipped && styles.cardFlipped,
                card.isMatched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(index)}
              disabled={card.isFlipped || card.isMatched || isChecking}
            >
              <Text style={styles.cardText}>
                {card.isFlipped || card.isMatched ? card.image : "?"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.foundPairsContainer}>
        <Text style={styles.foundPairsTitle}>Bulunan Eşler</Text>
        <View style={styles.foundPairsList}>
          {foundPairs.map((pair, index) => (
            <View key={index} style={styles.foundPairItem}>
              <Text style={styles.foundPairText}>{pair}</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    marginTop: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFD166",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: "#fff",
  },
  movesText: {
    fontSize: 18,
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  gameContainer: {
    padding: 20,
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  card: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF476F",
  },
  cardFlipped: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  cardMatched: {
    backgroundColor: "rgba(0,255,0,0.2)",
  },
  cardText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  score: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "rgba(255,215,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  gameArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#06D6A0",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#118AB2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  foundPairsContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#073B4C",
    maxHeight: 120,
  },
  foundPairsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  foundPairsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  foundPairItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF9F1C",
  },
  foundPairText: {
    color: "#fff",
    fontSize: 14,
  },
  gameInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF9F1C",
  },
  themeName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cardCount: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
