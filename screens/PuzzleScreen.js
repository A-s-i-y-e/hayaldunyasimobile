import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const { width } = Dimensions.get("window");
const PUZZLE_SIZE = width - 40; // Ekran genişliğinden kenar boşluklarını çıkar
const PIECE_SIZE = PUZZLE_SIZE / 3; // 3x3 yapboz için parça boyutu

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function PuzzleScreen() {
  const [currentStory, setCurrentStory] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 dakika
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [piecePositions, setPiecePositions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const [pieceAnimations, setPieceAnimations] = useState({});

  // Hikayeleri yükle
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);
        const storiesCollection = collection(db, "stories");
        const storiesSnapshot = await getDocs(storiesCollection);
        const stories = storiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Toplam hikaye sayısı:", stories.length);

        if (stories.length > 0) {
          const storiesWithDrawings = stories.filter(
            (story) => story.drawing && story.drawing.imageData
          );

          console.log(
            "Çizim içeren hikaye sayısı:",
            storiesWithDrawings.length
          );

          if (storiesWithDrawings.length > 0) {
            const randomStory =
              storiesWithDrawings[
                Math.floor(Math.random() * storiesWithDrawings.length)
              ];

            console.log("Seçilen hikaye ID:", randomStory.id);
            console.log("Çizim verisi var mı:", !!randomStory.drawing);
            console.log(
              "Resim verisi var mı:",
              !!randomStory.drawing?.imageData
            );

            if (randomStory.drawing?.imageData) {
              console.log(
                "Resim verisi başlangıcı:",
                randomStory.drawing.imageData.substring(0, 50)
              );
            }

            setCurrentStory(randomStory);

            let imageData = randomStory.drawing.imageData;
            if (typeof imageData === "string") {
              if (!imageData.startsWith("data:image")) {
                imageData = `data:image/png;base64,${imageData.replace(
                  /\n/g,
                  ""
                )}`;
                console.log(
                  "Formatlanmış resim verisi başlangıcı:",
                  imageData.substring(0, 50)
                );
              }
            }

            createPuzzlePieces(imageData);
          } else {
            Alert.alert(
              "Bilgi",
              "Henüz çizim içeren hikaye bulunmuyor. Lütfen önce bir hikaye çizin."
            );
          }
        }
      } catch (error) {
        console.error("Hikayeler yüklenirken hata oluştu:", error);
        Alert.alert(
          "Hata",
          "Hikayeler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Yapboz parçalarını oluştur
  const createPuzzlePieces = (imageData) => {
    if (!imageData) {
      console.error("Resim verisi bulunamadı");
      return;
    }

    console.log("Yapboz parçaları oluşturuluyor...");
    console.log("Resim verisi uzunluğu:", imageData.length);

    const pieces = [];
    const animations = {};

    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = Math.random() * (width - PIECE_SIZE);
      const y = PUZZLE_SIZE + 100 + Math.random() * 200;

      pieces.push({
        id: i,
        position: i,
        imageData,
        x,
        y,
        correctX: col * PIECE_SIZE,
        correctY: row * PIECE_SIZE,
      });

      // Her parça için animasyon değerleri oluştur
      animations[i] = {
        translateX: useSharedValue(x),
        translateY: useSharedValue(y),
      };
    }

    setPuzzlePieces(pieces);
    setPieceAnimations(animations);
  };

  // Zamanlayıcı
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      gameOver();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Oyunu başlat
  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(180);
    setScore(0);
    setPlacedPieces([]);
    setPiecePositions({});
  };

  // Oyunu bitir
  const gameOver = () => {
    setIsPlaying(false);
    Alert.alert("Oyun Bitti!", `Puanınız: ${score}`, [
      { text: "Tekrar Oyna", onPress: startGame },
    ]);
  };

  // Parça sürüklendiğinde
  const onPieceDrag = (pieceId, event) => {
    if (!isPlaying) return;

    const { x, y } = event.nativeEvent;
    setPiecePositions((prev) => ({
      ...prev,
      [pieceId]: { x, y },
    }));
  };

  // Parça bırakıldığında
  const onPieceDrop = (pieceId, event) => {
    if (!isPlaying) return;

    const { x, y } = event.nativeEvent;
    const targetX = Math.floor(x / PIECE_SIZE) * PIECE_SIZE;
    const targetY = Math.floor(y / PIECE_SIZE) * PIECE_SIZE;

    // Doğru pozisyonda mı kontrol et
    const correctPosition =
      pieceId ===
      Math.floor(targetY / PIECE_SIZE) * 3 + Math.floor(targetX / PIECE_SIZE);

    if (correctPosition) {
      // Parçayı yerleştir
      setPlacedPieces((prev) => [...prev, pieceId]);
      setScore((prev) => prev + 10);

      // Tüm parçalar yerleştirildi mi kontrol et
      if (placedPieces.length === 8) {
        completePuzzle();
      }
    } else {
      // Parçayı geri gönder
      const newX = Math.random() * (width - PIECE_SIZE);
      const newY = PUZZLE_SIZE + 100 + Math.random() * 200;

      setPiecePositions((prev) => ({
        ...prev,
        [pieceId]: { x: newX, y: newY },
      }));
    }
  };

  // Yapboz tamamlandığında
  const completePuzzle = () => {
    setIsPlaying(false);
    const timeBonus = Math.floor(timeLeft * 2);
    const finalScore = score + timeBonus;

    Alert.alert(
      "Tebrikler!",
      `Yapbozu tamamladınız!\nPuanınız: ${finalScore}\nZaman Bonusu: ${timeBonus}`,
      [
        {
          text: "Hikayeyi Oku",
          onPress: () => {
            /* Hikayeyi göster */
          },
        },
        { text: "Tekrar Oyna", onPress: startGame },
      ]
    );
  };

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#2E7D32", "#1B5E20"]}
          style={styles.container}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Yapboz Yükleniyor...</Text>
          </View>
        </LinearGradient>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Yapboz</Text>
          <View style={styles.stats}>
            <Text style={styles.score}>Puan: {score}</Text>
            <Text style={styles.timer}>
              Süre: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </View>

        {/* Debug bilgisi */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </View>

        <View style={styles.puzzleArea}>
          <View style={styles.puzzleGrid}>
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.puzzleSlot,
                    placedPieces.includes(index) && styles.placedPiece,
                  ]}
                />
              ))}
          </View>

          <View style={styles.piecesArea}>
            {puzzlePieces.map((piece) => {
              const animation = pieceAnimations[piece.id];
              if (!animation) return null;

              const animatedStyle = useAnimatedStyle(() => {
                return {
                  transform: [
                    { translateX: animation.translateX.value },
                    { translateY: animation.translateY.value },
                  ],
                };
              });

              return (
                <PanGestureHandler
                  key={piece.id}
                  onGestureEvent={(event) => {
                    if (!isPlaying) return;
                    animation.translateX.value = event.nativeEvent.x;
                    animation.translateY.value = event.nativeEvent.y;
                  }}
                  onEnded={(event) => {
                    if (!isPlaying) return;
                    const { x, y } = event.nativeEvent;
                    const targetX = Math.floor(x / PIECE_SIZE) * PIECE_SIZE;
                    const targetY = Math.floor(y / PIECE_SIZE) * PIECE_SIZE;

                    const correctPosition =
                      piece.id ===
                      Math.floor(targetY / PIECE_SIZE) * 3 +
                        Math.floor(targetX / PIECE_SIZE);

                    if (correctPosition) {
                      animation.translateX.value = withSpring(targetX);
                      animation.translateY.value = withSpring(targetY);
                      setPlacedPieces((prev) => [...prev, piece.id]);
                      setScore((prev) => prev + 10);
                    } else {
                      const newX = Math.random() * (width - PIECE_SIZE);
                      const newY = PUZZLE_SIZE + 100 + Math.random() * 200;
                      animation.translateX.value = withSpring(newX);
                      animation.translateY.value = withSpring(newY);
                    }
                  }}
                >
                  <Animated.View style={[styles.puzzlePiece, animatedStyle]}>
                    <Image
                      source={{ uri: piece.imageData }}
                      style={styles.pieceImage}
                      onError={(error) => {
                        console.error(
                          "Resim yüklenirken hata:",
                          error.nativeEvent
                        );
                        setDebugInfo(
                          (prev) =>
                            prev +
                            "\nResim yükleme hatası: " +
                            JSON.stringify(error.nativeEvent)
                        );
                      }}
                    />
                  </Animated.View>
                </PanGestureHandler>
              );
            })}
          </View>
        </View>

        {!isPlaying && (
          <TouchableOpacity style={styles.resetButton} onPress={startGame}>
            <Text style={styles.resetButtonText}>Yeniden Başla</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </GestureHandlerRootView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    gap: 10,
  },
  score: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 8,
  },
  timer: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 8,
  },
  puzzleArea: {
    flex: 1,
    alignItems: "center",
  },
  puzzleGrid: {
    width: PUZZLE_SIZE,
    height: PUZZLE_SIZE,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 2,
  },
  puzzleSlot: {
    width: PIECE_SIZE - 4,
    height: PIECE_SIZE - 4,
    margin: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  placedPiece: {
    backgroundColor: "rgba(46, 204, 113, 0.3)",
  },
  piecesArea: {
    marginTop: 20,
    width: PUZZLE_SIZE,
    height: 300,
    position: "relative",
  },
  puzzlePiece: {
    position: "absolute",
    width: PIECE_SIZE - 4,
    height: PIECE_SIZE - 4,
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
  },
  debugContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  debugText: {
    color: "#fff",
    fontSize: 12,
  },
});
