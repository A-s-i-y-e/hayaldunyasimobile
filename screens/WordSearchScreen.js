import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Masallardan seçilen örnek kelimeler
const WORDS = [
  { word: "PAMUK", tale: "Pamuk Prenses" },
  { word: "PRENSES", tale: "Pamuk Prenses" },
  { word: "KURT", tale: "Kırmızı Başlıklı Kız" },
  { word: "KULE", tale: "Rapunzel" },
  { word: "ELMA", tale: "Pamuk Prenses" },
  { word: "AYNA", tale: "Pamuk Prenses" },
  { word: "KALP", tale: "Kurbağa Prens" },
  { word: "TAÇ", tale: "Pamuk Prenses" },
  { word: "KRAL", tale: "Pamuk Prenses" },
  { word: "KRALİÇE", tale: "Pamuk Prenses" },
  { word: "SİHİR", tale: "Pamuk Prenses" },
  { word: "BÜYÜ", tale: "Pamuk Prenses" },
  { word: "PERİ", tale: "Uyuyan Güzel" },
  { word: "DEVR", tale: "Külkedisi" },
  { word: "ORMAN", tale: "Kırmızı Başlıklı Kız" },
  { word: "KÖŞK", tale: "Külkedisi" },
  { word: "KALE", tale: "Rapunzel" },
  { word: "ZİNDAN", tale: "Rapunzel" },
  { word: "HAZİNE", tale: "Ali Baba ve Kırk Haramiler" },
  { word: "MÜCEVHER", tale: "Ali Baba ve Kırk Haramiler" },
  { word: "KRALİYET", tale: "Pamuk Prenses" },
  { word: "PRENSESLİK", tale: "Pamuk Prenses" },
  { word: "BÜYÜCÜLÜK", tale: "Pamuk Prenses" },
  { word: "KRALİÇELİK", tale: "Pamuk Prenses" },
  { word: "SİHİRLİLİK", tale: "Pamuk Prenses" },
  { word: "BÜYÜLÜLÜK", tale: "Pamuk Prenses" },
  { word: "PERİLİLİK", tale: "Uyuyan Güzel" },
  { word: "DEVRİLİK", tale: "Külkedisi" },
  { word: "ORMANLIK", tale: "Kırmızı Başlıklı Kız" },
  { word: "KÖŞKLÜK", tale: "Külkedisi" },
  { word: "KALELİK", tale: "Rapunzel" },
  { word: "ZİNDANLIK", tale: "Rapunzel" },
  { word: "HAZİNELİK", tale: "Ali Baba ve Kırk Haramiler" },
  { word: "MÜCEVHERLİK", tale: "Ali Baba ve Kırk Haramiler" },
];

const WordPuzzleScreen = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [currentTale, setCurrentTale] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [inputLetters, setInputLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [attempts, setAttempts] = useState(0);

  // Rastgele kelime seç ve harfleri karıştır
  const generateNewWord = () => {
    const randomWordObj = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWordObj.word);
    setCurrentTale(randomWordObj.tale);

    // Harfleri karıştır
    const letters = randomWordObj.word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setScrambledLetters(letters);
    setInputLetters([]);
  };

  useEffect(() => {
    generateNewWord();
  }, []);

  const handleLetterPress = (letter) => {
    if (inputLetters.length >= currentWord.length) return;

    const newInputLetters = [...inputLetters, letter];
    setInputLetters(newInputLetters);

    // Her harf eklendiğinde kontrol et
    const currentInput = newInputLetters.join("");
    const correctPart = currentWord.substring(0, newInputLetters.length);

    if (currentInput === correctPart) {
      // Doğru harf dizisi
      if (newInputLetters.length === currentWord.length) {
        // Kelime tamamlandı
        const wordScore = currentWord.length * 10;
        setScore((prev) => prev + wordScore);
        setFoundWords((prev) => [
          ...prev,
          { word: currentWord, score: wordScore, tale: currentTale },
        ]);
        Alert.alert(
          "Tebrikler!",
          `Doğru kelimeyi buldunuz!\nPuan: ${wordScore}`
        );
        setTimeout(() => {
          generateNewWord();
          setInputLetters([]);
        }, 1500);
      }
    } else {
      // Yanlış harf dizisi
      Alert.alert("Yanlış Harf", "Tekrar deneyin!");
      setInputLetters([]);
    }
  };

  const resetSelection = () => {
    generateNewWord();
    setInputLetters([]);
  };

  const startNewGame = () => {
    setScore(0);
    setFoundWords([]);
    generateNewWord();
    setInputLetters([]);
  };

  const shuffleLetters = () => {
    const newLetters = [...scrambledLetters];
    for (let i = newLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newLetters[i], newLetters[j]] = [newLetters[j], newLetters[i]];
    }
    setScrambledLetters(newLetters);
  };

  return (
    <LinearGradient colors={["#2C3E50", "#3498DB"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelime Bulmacası</Text>
        <Text style={styles.score}>Puan: {score}</Text>
      </View>

      <View style={styles.foundWordsContainer}>
        <Text style={styles.foundWordsTitle}>Bulunan Kelimeler</Text>
        <ScrollView
          style={styles.foundWordsList}
          contentContainerStyle={{ flexDirection: "column-reverse" }}
        >
          <View style={styles.foundWordsGrid}>
            {[...foundWords].reverse().map((item, index) => (
              <View key={index} style={styles.foundWordItem}>
                <Text style={styles.foundWordText}>{item.word}</Text>
                <Text style={styles.foundWordScore}>+{item.score}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.gameArea}>
        <Text style={styles.taleName}>{currentTale}</Text>
        <View style={styles.wordDisplay}>
          {currentWord.split("").map((letter, index) => (
            <View key={index} style={styles.letterSlot}>
              <Text style={styles.letterSlotText}>
                {inputLetters[index] || "_"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.lettersContainer}>
          {scrambledLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.letterButton}
              onPress={() => handleLetterPress(letter)}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={resetSelection}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Sıfırla</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={shuffleLetters}
          >
            <Ionicons name="shuffle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Karıştır</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={startNewGame}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.buttonText}>Yeni Oyun</Text>
          </TouchableOpacity>
        </View>
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
  gameArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  taleName: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  wordDisplay: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  letterSlot: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#06D6A0",
  },
  letterSlotText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  lettersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 15,
  },
  letterButton: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF476F",
  },
  letterText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
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
  foundWordsContainer: {
    marginTop: 8,
    maxHeight: 600,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#073B4C",
  },
  foundWordsTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  foundWordsList: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#FF9F1C",
  },
  foundWordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 4,
  },
  foundWordItem: {
    width: "32%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  foundWordText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  foundWordScore: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default WordPuzzleScreen;
