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
import { Ionicons } from "@expo/vector-icons";

const ALL_OBJECTS = [
  { id: 1, name: "Elma", icon: "🍎" },
  { id: 2, name: "Muz", icon: "🍌" },
  { id: 3, name: "Çilek", icon: "🍓" },
  { id: 4, name: "Portakal", icon: "🍊" },
  { id: 5, name: "Üzüm", icon: "🍇" },
  { id: 6, name: "Karpuz", icon: "🍉" },
  { id: 7, name: "Armut", icon: "🍐" },
  { id: 8, name: "Kiraz", icon: "🍒" },
  { id: 9, name: "Limon", icon: "🍋" },
  { id: 10, name: "Şeftali", icon: "🍑" },
  { id: 11, name: "Ananas", icon: "🍍" },
  { id: 12, name: "Kivi", icon: "🥝" },
  { id: 13, name: "Nar", icon: "🍈" },
  { id: 14, name: "İncir", icon: "🍏" },
  { id: 15, name: "Mango", icon: "🥭" },
  { id: 16, name: "Avokado", icon: "🥑" },
  { id: 17, name: "Böğürtlen", icon: "🫐" },
  { id: 18, name: "Ahududu", icon: "🍇" },
];

const NumberGameScreen = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [foundNumbers, setFoundNumbers] = useState([]);
  const [currentObjects, setCurrentObjects] = useState([]);

  const getRandomObjects = () => {
    const shuffled = [...ALL_OBJECTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9);
  };

  const generateNewNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    setTargetNumber(randomNumber);
    setSelectedObjects([]);
  };

  useEffect(() => {
    setCurrentObjects(getRandomObjects());
    generateNewNumber();
  }, []);

  const handleObjectPress = (object) => {
    if (selectedObjects.includes(object)) {
      setSelectedObjects(
        selectedObjects.filter((item) => item.id !== object.id)
      );
    } else {
      if (selectedObjects.length < targetNumber) {
        setSelectedObjects([...selectedObjects, object]);
      }
    }
  };

  const checkAnswer = () => {
    if (selectedObjects.length === targetNumber) {
      const newScore = targetNumber * 10;
      setScore((prev) => prev + newScore);
      setFoundNumbers((prev) => [
        ...prev,
        { number: targetNumber, score: newScore },
      ]);
      Alert.alert(
        "Tebrikler!",
        `Doğru sayıda nesne seçtiniz!\nPuan: ${newScore}`
      );
      setTimeout(() => {
        generateNewNumber();
      }, 1500);
    } else {
      Alert.alert("Yanlış!", `Lütfen ${targetNumber} adet nesne seçin.`);
    }
  };

  const resetGame = () => {
    generateNewNumber();
  };

  const startNewGame = () => {
    setScore(0);
    setFoundNumbers([]);
    setCurrentObjects(getRandomObjects());
    generateNewNumber();
  };

  return (
    <LinearGradient colors={["#2C3E50", "#3498DB"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sayı Oyunu</Text>
        <Text style={styles.score}>Puan: {score}</Text>
      </View>

      <View style={styles.foundNumbersContainer}>
        <Text style={styles.foundNumbersTitle}>Bulunan Sayılar</Text>
        <ScrollView
          style={styles.foundNumbersList}
          contentContainerStyle={{ flexDirection: "column-reverse" }}
        >
          <View style={styles.foundNumbersGrid}>
            {[...foundNumbers].reverse().map((item, index) => (
              <View key={index} style={styles.foundNumberItem}>
                <Text style={styles.foundNumberText}>{item.number}</Text>
                <Text style={styles.foundNumberScore}>+{item.score}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.targetNumberContainer}>
          <Text style={styles.targetNumber}>{targetNumber}</Text>
          <Text style={styles.targetText}>nesne seçin</Text>
        </View>

        <View style={styles.objectsContainer}>
          {currentObjects.map((object) => (
            <TouchableOpacity
              key={object.id}
              style={[
                styles.objectButton,
                selectedObjects.includes(object) && styles.selectedObject,
              ]}
              onPress={() => handleObjectPress(object)}
            >
              <Text style={styles.objectIcon}>{object.icon}</Text>
              <Text style={styles.objectName}>{object.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={checkAnswer}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.buttonText}>Kontrol Et</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={resetGame}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Sıfırla</Text>
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
  foundNumbersContainer: {
    marginTop: 8,
    maxHeight: 600,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#073B4C",
  },
  foundNumbersTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  foundNumbersList: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#FF9F1C",
  },
  foundNumbersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 4,
  },
  foundNumberItem: {
    width: "32%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  foundNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  foundNumberScore: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  gameArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  targetNumberContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  targetNumber: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  targetText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  objectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  objectButton: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF476F",
  },
  selectedObject: {
    backgroundColor: "rgba(239,71,111,0.3)",
    borderColor: "#FFD166",
  },
  objectIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  objectName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
});

export default NumberGameScreen;
