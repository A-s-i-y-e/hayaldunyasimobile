import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PuzzleScreen() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const images = [
    "https://cdn-icons-png.flaticon.com/512/1995/1995591.png",
    "https://cdn-icons-png.flaticon.com/512/1995/1995592.png",
    "https://cdn-icons-png.flaticon.com/512/1995/1995593.png",
  ];

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    const pieces = Array.from({ length: level + 2 }, (_, index) => ({
      id: index,
      image: images[Math.floor(Math.random() * images.length)],
      position: index,
      isCorrect: false,
    })).sort(() => Math.random() - 0.5);
    setPuzzlePieces(pieces);
    setSelectedPiece(null);
  };

  const handlePiecePress = (piece) => {
    if (selectedPiece === null) {
      setSelectedPiece(piece);
    } else {
      const newPieces = [...puzzlePieces];
      const piece1Index = newPieces.findIndex((p) => p.id === piece.id);
      const piece2Index = newPieces.findIndex((p) => p.id === selectedPiece.id);

      [newPieces[piece1Index], newPieces[piece2Index]] = [
        newPieces[piece2Index],
        newPieces[piece1Index],
      ];

      setPuzzlePieces(newPieces);
      setSelectedPiece(null);

      const isCorrect = newPieces.every((p, index) => p.position === index);
      if (isCorrect) {
        setScore(score + 10);
        Alert.alert("Tebrikler!", "Yapbozu tamamladın!");
        setLevel(level + 1);
      }
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapboz</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Puan: {score}</Text>
        <Text style={styles.levelText}>Seviye: {level}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.gameContainer}>
          <View style={styles.puzzleContainer}>
            {puzzlePieces.map((piece) => (
              <TouchableOpacity
                key={piece.id}
                style={[
                  styles.puzzlePiece,
                  selectedPiece?.id === piece.id && styles.selectedPiece,
                ]}
                onPress={() => handlePiecePress(piece)}
              >
                <Image
                  source={{ uri: piece.image }}
                  style={styles.pieceImage}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
            <Text style={styles.resetButtonText}>Yeniden Başla</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
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
  levelText: {
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
  puzzleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  puzzlePiece: {
    width: 100,
    height: 100,
    margin: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    overflow: "hidden",
  },
  selectedPiece: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  pieceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  resetButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
