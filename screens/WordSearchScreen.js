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
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const { width } = Dimensions.get("window");

// Masallardan seçilen örnek kelimeler
const WORDS = [
  // Macera Hikayesi'nden Kelimeler
  { word: "KAHRAMAN", tale: "Macera Hikayesi" },
  { word: "MAĞARA", tale: "Macera Hikayesi" },
  { word: "CANAVAR", tale: "Macera Hikayesi" },
  { word: "ANAHTAR", tale: "Macera Hikayesi" },
  { word: "KÖPRÜ", tale: "Macera Hikayesi" },
  { word: "ŞEHİR", tale: "Macera Hikayesi" },
  { word: "OYUN", tale: "Macera Hikayesi" },
  { word: "MUTLULUK", tale: "Macera Hikayesi" },
  { word: "CESARET", tale: "Macera Hikayesi" },
  { word: "ARKADAŞ", tale: "Macera Hikayesi" },

  // Fantastik Hikaye'den Kelimeler
  { word: "SİHİR", tale: "Fantastik Hikaye" },
  { word: "BÜYÜCÜ", tale: "Fantastik Hikaye" },
  { word: "DEĞNEK", tale: "Fantastik Hikaye" },
  { word: "HAYVAN", tale: "Fantastik Hikaye" },
  { word: "YETENEK", tale: "Fantastik Hikaye" },
  { word: "DUYGU", tale: "Fantastik Hikaye" },
  { word: "RENK", tale: "Fantastik Hikaye" },
  { word: "HAYAL", tale: "Fantastik Hikaye" },
  { word: "GÜÇ", tale: "Fantastik Hikaye" },
  { word: "DÜNYA", tale: "Fantastik Hikaye" },

  // Arkadaşlık Hikayesi'nden Kelimeler
  { word: "PARK", tale: "Arkadaşlık Hikayesi" },
  { word: "OKUL", tale: "Arkadaşlık Hikayesi" },
  { word: "ÖĞRENCİ", tale: "Arkadaşlık Hikayesi" },
  { word: "KEDİ", tale: "Arkadaşlık Hikayesi" },
  { word: "YARDIM", tale: "Arkadaşlık Hikayesi" },
  { word: "ÖDEV", tale: "Arkadaşlık Hikayesi" },
  { word: "TENEFÜS", tale: "Arkadaşlık Hikayesi" },
  { word: "MAHALLE", tale: "Arkadaşlık Hikayesi" },
  { word: "BESLEMEK", tale: "Arkadaşlık Hikayesi" },
  { word: "ZİYARET", tale: "Arkadaşlık Hikayesi" },
];

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyBZd34mxld_RxluU34LrvBBRO8trt3PFXo",
  authDomain: "hayal-dunyasi.firebaseapp.com",
  projectId: "hayal-dunyasi",
  storageBucket: "hayal-dunyasi.firebasestorage.app",
  messagingSenderId: "875624820974",
  appId: "1:875624820974:web:471a827e14117b441c83ff",
  measurementId: "G-4JEQEPKFQ4",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hikayelerden kelime seçme fonksiyonu
const extractWordsFromStories = (stories) => {
  const words = [];

  stories.forEach((story) => {
    // Hikaye başlığını ekle
    words.push({
      word: story.title.toUpperCase(),
      tale: story.title,
    });

    // Hikaye içeriğinden anlamlı kelimeleri çıkar
    const content = story.content;
    const sentences = content.split(/[.!?]+/);

    sentences.forEach((sentence) => {
      // Cümleyi kelimelere ayır
      const sentenceWords = sentence.trim().split(/\s+/);

      // Her cümleden en anlamlı 2-3 kelimeyi seç
      const meaningfulWords = sentenceWords
        .filter(
          (word) =>
            word.length >= 4 && // En az 4 harfli kelimeler
            ![
              "ve",
              "ile",
              "için",
              "bu",
              "bir",
              "da",
              "de",
              "mi",
              "mı",
              "mu",
              "mü",
            ].includes(word.toLowerCase()) // Gereksiz kelimeleri filtrele
        )
        .slice(0, 3); // Her cümleden en fazla 3 kelime al

      meaningfulWords.forEach((word) => {
        // Kelimeyi büyük harfe çevir ve özel karakterleri kaldır
        const cleanWord = word.toUpperCase().replace(/[^A-ZĞÜŞİÖÇ]/g, "");
        if (cleanWord.length >= 4) {
          // Temizlenmiş kelime hala 4 harften uzunsa ekle
          words.push({
            word: cleanWord,
            tale: story.title,
          });
        }
      });
    });
  });

  return words;
};

// Kelimeleri zorluk seviyesine göre sıralama fonksiyonu
const sortWordsByDifficulty = (words) => {
  return words.sort((a, b) => {
    // Önce kelime uzunluğuna göre sırala
    if (a.word.length !== b.word.length) {
      return a.word.length - b.word.length;
    }

    // Aynı uzunluktaki kelimeler için özel karakter sayısına göre sırala
    const specialCharsA = (a.word.match(/[ĞÜŞİÖÇ]/g) || []).length;
    const specialCharsB = (b.word.match(/[ĞÜŞİÖÇ]/g) || []).length;
    return specialCharsA - specialCharsB;
  });
};

// Türkçe karakterleri koruyarak kelimeyi karıştırma fonksiyonu
const shuffleTurkishWord = (word) => {
  // Kelimeyi harflerine ayır
  const letters = word.split("");

  // Türkçe karakterleri ve normal harfleri ayrı ayrı karıştır
  const turkishChars = letters.filter((char) => "ĞÜŞİÖÇğüşıöç".includes(char));
  const normalChars = letters.filter((char) => !"ĞÜŞİÖÇğüşıöç".includes(char));

  // Normal harfleri karıştır
  for (let i = normalChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normalChars[i], normalChars[j]] = [normalChars[j], normalChars[i]];
  }

  // Türkçe karakterleri karıştır
  for (let i = turkishChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [turkishChars[i], turkishChars[j]] = [turkishChars[j], turkishChars[i]];
  }

  // Karıştırılmış harfleri birleştir
  const shuffledLetters = [...normalChars, ...turkishChars];

  // Son kelimeyi oluştur
  return shuffledLetters.join("");
};

const WordPuzzleScreen = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [currentTale, setCurrentTale] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [inputLetters, setInputLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [availableWords, setAvailableWords] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0); // Mevcut zorluk seviyesi
  const [wordsFoundInLevel, setWordsFoundInLevel] = useState(0); // Seviyede bulunan kelime sayısı

  // Hikayelerden kelimeleri çıkar
  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Firestore'dan hikayeleri çek
        const storiesCollection = collection(db, "stories");
        const storiesSnapshot = await getDocs(storiesCollection);
        const stories = storiesSnapshot.docs.map((doc) => ({
          title: doc.data().title,
          content: doc.data().content,
        }));

        if (stories.length > 0) {
          const words = extractWordsFromStories(stories);
          const sortedWords = sortWordsByDifficulty(words);
          setAvailableWords(sortedWords);
          generateNewWord(sortedWords);
        } else {
          // Hikaye yoksa varsayılan kelimeleri kullan
          const sortedWords = sortWordsByDifficulty(WORDS);
          setAvailableWords(sortedWords);
          generateNewWord(sortedWords);
        }
      } catch (error) {
        console.error("Hikayeler yüklenirken hata oluştu:", error);
        // Hata durumunda varsayılan kelimeleri kullan
        const sortedWords = sortWordsByDifficulty(WORDS);
        setAvailableWords(sortedWords);
        generateNewWord(sortedWords);
      }
    };

    fetchStories();
  }, []);

  // Rastgele kelime seç ve harfleri karıştır
  const generateNewWord = (words = availableWords) => {
    if (words.length === 0) return;

    // Mevcut seviyeye uygun kelimeleri filtrele
    const levelWords = words.filter((word) => {
      const wordLength = word.word.length;
      // Seviye 0: 4 harfli kelimeler
      // Seviye 1: 5 harfli kelimeler
      // Seviye 2: 6 harfli kelimeler
      // Seviye 3: 7 harfli kelimeler
      // Seviye 4: 8+ harfli kelimeler
      if (currentLevel === 0) return wordLength === 4;
      if (currentLevel === 1) return wordLength === 5;
      if (currentLevel === 2) return wordLength === 6;
      if (currentLevel === 3) return wordLength === 7;
      return wordLength >= 8;
    });

    if (levelWords.length === 0) {
      // Eğer mevcut seviyede kelime kalmadıysa, seviyeyi artır
      setCurrentLevel((prev) => Math.min(prev + 1, 4));
      setWordsFoundInLevel(0);
      return generateNewWord(words);
    }

    const randomWordObj =
      levelWords[Math.floor(Math.random() * levelWords.length)];
    setCurrentWord(randomWordObj.word);
    setCurrentTale(randomWordObj.tale);

    // Kelimeyi Türkçe karakterleri koruyarak karıştır
    const shuffledWord = shuffleTurkishWord(randomWordObj.word);
    setScrambledLetters(shuffledWord.split(""));
    setInputLetters([]);
  };

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

        // Seviyede bulunan kelime sayısını artır
        const newWordsFoundInLevel = wordsFoundInLevel + 1;
        setWordsFoundInLevel(newWordsFoundInLevel);

        // Her seviyede 3 kelime bulunduğunda bir üst seviyeye geç
        if (newWordsFoundInLevel >= 3) {
          setCurrentLevel((prev) => Math.min(prev + 1, 4));
          setWordsFoundInLevel(0);
        }

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
