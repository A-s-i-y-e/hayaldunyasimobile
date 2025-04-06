import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const PUZZLE_IMAGES = [
  {
    id: 1,
    name: "Pamuk Prenses",
    image: require("../assets/puzzle1.jpg"),
    rows: 3,
    cols: 3,
  },
  {
    id: 2,
    name: "Kırmızı Başlıklı Kız",
    image: require("../assets/puzzle2.jpg"),
    rows: 3,
    cols: 3,
  },
  {
    id: 3,
    name: "Ali Baba",
    image: require("../assets/puzzle3.jpg"),
    rows: 3,
    cols: 3,
  },
];

const PuzzleGameScreen = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [score, setScore] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const { width } = Dimensions.get("window");
  const pieceSize = (width - 40) / 3;

  const createPuzzlePieces = (image, rows, cols) => {
    const newPieces = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newPieces.push({
          id: `${row}-${col}`,
          correctPosition: { row, col },
          currentPosition: { row, col },
          image: image,
        });
      }
    }
    return newPieces;
  };

  const shufflePieces = (pieces) => {
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] = [
        shuffled[j].currentPosition,
        shuffled[i].currentPosition,
      ];
    }
    return shuffled;
  };

  const startNewPuzzle = () => {
    const availablePuzzles = PUZZLE_IMAGES.filter(
      (puzzle) => !completedPuzzles.includes(puzzle.id)
    );
    if (availablePuzzles.length === 0) {
      Alert.alert("Tebrikler!", "Tüm yapbozları tamamladınız!");
      return;
    }
    const randomPuzzle =
      availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
    const newPieces = createPuzzlePieces(
      randomPuzzle.image,
      randomPuzzle.rows,
      randomPuzzle.cols
    );
    setCurrentPuzzle(randomPuzzle);
    setPieces(shufflePieces(newPieces));
    setSelectedPiece(null);
  };

  useEffect(() => {
    startNewPuzzle();
  }, []);

  const handlePiecePress = (piece) => {
    if (selectedPiece) {
      const newPieces = [...pieces];
      const piece1Index = newPieces.findIndex((p) => p.id === selectedPiece.id);
      const piece2Index = newPieces.findIndex((p) => p.id === piece.id);
      [
        newPieces[piece1Index].currentPosition,
        newPieces[piece2Index].currentPosition,
      ] = [
        newPieces[piece2Index].currentPosition,
        newPieces[piece1Index].currentPosition,
      ];
      setPieces(newPieces);
      setSelectedPiece(null);
      checkCompletion(newPieces);
    } else {
      setSelectedPiece(piece);
    }
  };

  const checkCompletion = (currentPieces) => {
    const isComplete = currentPieces.every(
      (piece) =>
        piece.currentPosition.row === piece.correctPosition.row &&
        piece.currentPosition.col === piece.correctPosition.col
    );
    if (isComplete) {
      const newScore = currentPuzzle.rows * currentPuzzle.cols * 10;
      setScore((prev) => prev + newScore);
      setCompletedPuzzles((prev) => [...prev, currentPuzzle.id]);
      Alert.alert("Tebrikler!", `Yapbozu tamamladınız!\nPuan: ${newScore}`);
      setTimeout(() => {
        startNewPuzzle();
      }, 1500);
    }
  };

  return (
    <LinearGradient colors={["#2C3E50", "#3498DB"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapboz Oyunu</Text>
        <Text style={styles.score}>Puan: {score}</Text>
      </View>

      <View style={styles.puzzleInfo}>
        <Text style={styles.puzzleName}>{currentPuzzle?.name}</Text>
      </View>

      <View style={styles.puzzleContainer}>
        {pieces.map((piece) => (
          <TouchableOpacity
            key={piece.id}
            style={[
              styles.piece,
              {
                width: pieceSize,
                height: pieceSize,
                left: piece.currentPosition.col * pieceSize,
                top: piece.currentPosition.row * pieceSize,
                borderColor:
                  selectedPiece?.id === piece.id ? "#FFD166" : "#EF476F",
              },
            ]}
            onPress={() => handlePiecePress(piece)}
          >
            <Image
              source={piece.image}
              style={[
                styles.pieceImage,
                {
                  width: pieceSize * 3,
                  height: pieceSize * 3,
                  left: -piece.correctPosition.col * pieceSize,
                  top: -piece.correctPosition.row * pieceSize,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={startNewPuzzle}>
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.buttonText}>Yeni Yapboz</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

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
  puzzleInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  puzzleName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  puzzleContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#06D6A0",
  },
  piece: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 8,
  },
  pieceImage: {
    position: "absolute",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
});

export default PuzzleGameScreen;
