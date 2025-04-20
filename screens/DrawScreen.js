import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  PanResponder,
  Dimensions,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  Canvas,
  Path,
  Skia,
  useDrawCallback,
} from "@shopify/react-native-skia";
import { useNavigation } from "@react-navigation/native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { storage } from "../config/firebase";

const { width, height } = Dimensions.get("window");

// Fırça stilleri
const BRUSH_TYPES = {
  PEN: "pen",
  BRUSH: "brush",
  MARKER: "marker",
  SPRAY: "spray",
};

// Şekil tipleri
const SHAPE_TYPES = {
  LINE: "line",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  TRIANGLE: "triangle",
  STAR: "star",
  HEART: "heart",
  PENTAGON: "pentagon",
};

// Desen tipleri
const PATTERN_TYPES = {
  NONE: "none",
  GRID: "grid",
  DOTS: "dots",
  LINES: "lines",
  CIRCLES: "circles",
  SQUARES: "squares",
  TRIANGLES: "triangles",
  STARS: "stars",
  HEARTS: "hearts",
  CLOUDS: "clouds",
  FLOWERS: "flowers",
  BUTTERFLIES: "butterflies",
  RAINBOW: "rainbow",
  BUBBLES: "bubbles",
};

const getPatternIcon = (pattern) => {
  switch (pattern) {
    case PATTERN_TYPES.NONE:
      return "close";
    case PATTERN_TYPES.GRID:
      return "grid";
    case PATTERN_TYPES.DOTS:
      return "dots-grid";
    case PATTERN_TYPES.LINES:
      return "format-line-spacing";
    case PATTERN_TYPES.CIRCLES:
      return "circle-multiple";
    case PATTERN_TYPES.SQUARES:
      return "square";
    case PATTERN_TYPES.TRIANGLES:
      return "triangle";
    case PATTERN_TYPES.STARS:
      return "star";
    case PATTERN_TYPES.HEARTS:
      return "heart";
    default:
      return "close";
  }
};

const getShapeIcon = (shape) => {
  switch (shape) {
    case SHAPE_TYPES.LINE:
      return "vector-line";
    case SHAPE_TYPES.RECTANGLE:
      return "rectangle-outline";
    case SHAPE_TYPES.CIRCLE:
      return "circle-outline";
    case SHAPE_TYPES.TRIANGLE:
      return "triangle-outline";
    case SHAPE_TYPES.STAR:
      return "star-outline";
    case SHAPE_TYPES.HEART:
      return "heart-outline";
    case SHAPE_TYPES.PENTAGON:
      return "pentagon-outline";
    default:
      return "close";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    margin: 10,
  },
  canvas: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomTools: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    gap: 4,
  },
  toolSection: {
    alignItems: "center",
  },
  brushTypes: {
    flexDirection: "row",
    gap: 8,
  },
  brushTypeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  penButton: {
    backgroundColor: "#FF6B6B", // Kırmızımsı pembe
  },
  brushButton: {
    backgroundColor: "#4ECDC4", // Turkuaz
  },
  markerButton: {
    backgroundColor: "#FFD166", // Sarı
  },
  sprayButton: {
    backgroundColor: "#A78BFA", // Mor
  },
  shapeButton: {
    backgroundColor: "#FF9F1C", // Turuncu
  },
  brushSizeButton: {
    backgroundColor: "#2EC4B6", // Açık mavi
  },
  colorButton: {
    backgroundColor: "#E71D36", // Kırmızı
  },
  fillButton: {
    backgroundColor: "#FF9F1C", // Turuncu
  },
  patternButton: {
    backgroundColor: "#9B5DE5", // Mor
  },
  colorSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
    marginBottom: 1,
    paddingHorizontal: 5,
    width: "100%",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#FFD700",
    transform: [{ scale: 1.1 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  colorPickerContainer: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 10,
    zIndex: 1000,
  },
  patternPickerContainer: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 10,
    zIndex: 1000,
  },
  patternGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  selectedPattern: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  gridLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#000",
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  line: {
    position: "absolute",
    width: "100%",
    height: 1,
  },
  circle: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  square: {
    position: "absolute",
    width: 12,
    height: 12,
  },
  triangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  star: {
    position: "absolute",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    position: "absolute",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cloud: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  flower: {
    position: "absolute",
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  butterfly: {
    position: "absolute",
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  rainbow: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.7,
  },
  brushSizeIndicator: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  patternPreview: {
    width: 40,
    height: 40,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  previewLine: {
    position: "absolute",
    width: 20,
    height: 1,
    backgroundColor: "#fff",
  },
  previewDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  previewCircle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  previewSquare: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#fff",
  },
  previewTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  previewBubble: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    opacity: 0.7,
  },
  opacityPreviewContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden",
  },
  opacityPreview: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
  },
});

export default function DrawScreen() {
  const navigation = useNavigation();
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isEraser, setIsEraser] = useState(false);
  const [brushType, setBrushType] = useState(BRUSH_TYPES.PEN);
  const [shapeType, setShapeType] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawingName, setDrawingName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isBackgroundPickerVisible, setIsBackgroundPickerVisible] =
    useState(false);
  const [backgroundPattern, setBackgroundPattern] = useState(null);
  const [isPatternPickerVisible, setIsPatternPickerVisible] = useState(false);
  const viewShotRef = useRef();
  const canvasRef = useRef(null);
  const db = getFirestore();
  const auth = getAuth();
  const [isShapePickerVisible, setIsShapePickerVisible] = useState(false);
  const [isBrushSizePickerVisible, setIsBrushSizePickerVisible] =
    useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isOpacityPickerVisible, setIsOpacityPickerVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const colors = [
    "#FF0000", // Kırmızı
    "#FF4500", // Turuncu-Kırmızı
    "#FF6347", // Domates
    "#FF8C00", // Koyu Turuncu
    "#FFA500", // Turuncu
    "#FFD700", // Altın
    "#FFFF00", // Sarı
    "#7CFC00", // Çimen
    "#00FF00", // Yeşil
    "#20B2AA", // Açık Deniz Mavisi
    "#00FFFF", // Turkuaz
    "#4169E1", // Kraliyet Mavisi
    "#0000FF", // Mavi
    "#4B0082", // İndigo
    "#800080", // Mor
    "#DDA0DD", // Erik
    "#FF69B4", // Açık Pembe
    "#FF00FF", // Pembe
    "#E6E6FA", // Lavanta
    "#FFB6C1", // Açık Pembe
    "#FFC0CB", // Pembe
    "#808080", // Gri
    "#000000", // Siyah
    "#FFFFFF", // Beyaz
  ];

  const brushSizes = [2, 5, 10, 15];

  const opacityLevels = [0.2, 0.4, 0.6, 0.8, 1];

  const handleTouchMove = (event) => {
    if (!isDrawing) return;

    const { locationX, locationY } = event.nativeEvent;

    // Canvas sınırlarını kontrol et
    const canvasLeft = 60; // Sol menü genişliği
    const canvasTop = 0;
    const canvasRight = width - 60; // Sağ kenar boşluğu
    const canvasBottom = height - 100; // Alt kenar boşluğu

    // Noktayı canvas sınırları içinde tut
    const x = Math.max(canvasLeft, Math.min(locationX, canvasRight));
    const y = Math.max(canvasTop, Math.min(locationY, canvasBottom));

    setCurrentPath((prev) => ({
      ...prev,
      points: [...prev.points, { x, y }],
      opacity: opacity,
    }));
  };

  const handleShapeMove = (event) => {
    if (!isDrawing) return;

    const { locationX, locationY } = event.nativeEvent;

    // Canvas sınırlarını kontrol et
    const canvasLeft = 60;
    const canvasTop = 0;
    const canvasRight = width - 60;
    const canvasBottom = height - 100;

    // Noktayı canvas sınırları içinde tut
    const x = Math.max(canvasLeft, Math.min(locationX, canvasRight));
    const y = Math.max(canvasTop, Math.min(locationY, canvasBottom));

    setCurrentPath((prev) => ({
      ...prev,
      points: [prev.points[0], { x, y }],
    }));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;

      // Canvas sınırlarını kontrol et
      const canvasLeft = 60;
      const canvasTop = 0;
      const canvasRight = width - 60;
      const canvasBottom = height - 100;

      // Noktayı canvas sınırları içinde tut
      const x = Math.max(canvasLeft, Math.min(locationX, canvasRight));
      const y = Math.max(canvasTop, Math.min(locationY, canvasBottom));

      if (shapeType) {
        setStartPoint({ x, y });
        setCurrentPath([{ x, y }]);
      } else {
        setCurrentPath([{ x, y }]);
      }
    },
    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;

      // Canvas sınırlarını kontrol et
      const canvasLeft = 60;
      const canvasTop = 0;
      const canvasRight = width - 60;
      const canvasBottom = height - 100;

      // Noktayı canvas sınırları içinde tut
      const x = Math.max(canvasLeft, Math.min(locationX, canvasRight));
      const y = Math.max(canvasTop, Math.min(locationY, canvasBottom));

      if (shapeType && startPoint) {
        switch (shapeType) {
          case SHAPE_TYPES.LINE:
            setCurrentPath([startPoint, { x, y }]);
            break;
          case SHAPE_TYPES.RECTANGLE:
            setCurrentPath([
              startPoint,
              { x, y: startPoint.y },
              { x, y },
              { x: startPoint.x, y },
              startPoint,
            ]);
            break;
          case SHAPE_TYPES.CIRCLE:
            const radius = Math.sqrt(
              Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2)
            );
            const points = [];
            for (let i = 0; i < 36; i++) {
              const angle = (i * 10 * Math.PI) / 180;
              points.push({
                x: startPoint.x + radius * Math.cos(angle),
                y: startPoint.y + radius * Math.sin(angle),
              });
            }
            setCurrentPath(points);
            break;
          case SHAPE_TYPES.TRIANGLE:
            setCurrentPath([
              startPoint,
              { x, y },
              { x: startPoint.x - (x - startPoint.x), y },
              startPoint,
            ]);
            break;
          case SHAPE_TYPES.STAR:
            const starRadius = Math.sqrt(
              Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2)
            );
            const starPoints = [];
            for (let i = 0; i < 5; i++) {
              const angle = (i * 4 * Math.PI) / 5;
              starPoints.push({
                x: startPoint.x + starRadius * Math.sin(angle),
                y: startPoint.y - starRadius * Math.cos(angle),
              });
            }
            setCurrentPath(starPoints);
            break;
          case SHAPE_TYPES.HEART:
            const heartRadius = Math.sqrt(
              Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2)
            );
            const heartPoints = [];
            for (let i = 0; i < 20; i++) {
              const t = (i * Math.PI) / 10;
              heartPoints.push({
                x: startPoint.x + heartRadius * 16 * Math.pow(Math.sin(t), 3),
                y:
                  startPoint.y -
                  heartRadius *
                    (13 * Math.cos(t) -
                      5 * Math.cos(2 * t) -
                      2 * Math.cos(3 * t) -
                      Math.cos(4 * t)),
              });
            }
            setCurrentPath(heartPoints);
            break;
          case SHAPE_TYPES.PENTAGON:
            const pentagonRadius = Math.sqrt(
              Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2)
            );
            const pentagonPoints = [];
            for (let i = 0; i < 5; i++) {
              const angle = (i * 2 * Math.PI) / 5;
              pentagonPoints.push({
                x: startPoint.x + pentagonRadius * Math.cos(angle),
                y: startPoint.y + pentagonRadius * Math.sin(angle),
              });
            }
            setCurrentPath(pentagonPoints);
            break;
        }
      } else {
        setCurrentPath((prevPath) => [...prevPath, { x, y }]);
      }
    },
    onPanResponderRelease: () => {
      if (currentPath.length > 0) {
        const newPath = {
          points: currentPath,
          color: isEraser ? "#FFFFFF" : currentColor,
          size: brushSize,
          type: shapeType || brushType,
          opacity: opacity,
        };

        if (shapeType) {
          if (currentPath.length >= 2) {
            setPaths((prevPaths) => [...prevPaths, newPath]);
          }
        } else {
          setPaths((prevPaths) => [...prevPaths, newPath]);
        }
      }
      setCurrentPath([]);
      setStartPoint(null);
    },
  });

  const handleUndo = () => {
    if (paths.length > 0) {
      const lastPath = paths[paths.length - 1];
      setUndoStack((prev) => [...prev, lastPath]);
      setPaths((prevPaths) => prevPaths.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (undoStack.length > 0) {
      const lastUndo = undoStack[undoStack.length - 1];
      setPaths((prevPaths) => [...prevPaths, lastUndo]);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    Alert.alert("Temizle", "Çizimi temizlemek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Temizle", onPress: () => setPaths([]), style: "destructive" },
    ]);
  };

  const handleSaveDrawing = async () => {
    if (!auth.currentUser) {
      Alert.alert("Hata", "Lütfen önce giriş yapın");
      return;
    }

    if (!drawingName.trim()) {
      Alert.alert("Hata", "Lütfen çiziminize bir isim verin");
      return;
    }

    try {
      // Canvas'ı base64 formatında görüntüye çevir
      const uri = await viewShotRef.current.capture();
      if (!uri) {
        throw new Error("Görüntü oluşturulamadı");
      }

      // Base64 formatını kontrol et ve düzelt
      const base64Data = uri.startsWith("data:image")
        ? uri
        : `data:image/png;base64,${uri}`;

      // Firestore'a kaydet
      const drawingData = {
        userId: auth.currentUser.uid,
        name: drawingName,
        imageData: base64Data,
        createdAt: serverTimestamp(),
        type: "drawing",
      };

      const drawingsCollection = collection(db, "drawings");
      const docRef = await addDoc(drawingsCollection, drawingData);
      if (!docRef) {
        throw new Error("Firestore'a kaydedilemedi");
      }

      Alert.alert("Başarılı", "Çiziminiz başarıyla kaydedildi");
      setDrawingName("");
      setIsModalVisible(false);
      navigation.navigate("CreateStory", {
        drawingData: base64Data,
        drawingName: drawingName,
      });
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      Alert.alert(
        "Hata",
        `Çizim kaydedilirken bir hata oluştu: ${error.message}`
      );
    }
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    setIsBackgroundPickerVisible(false);
  };

  const handlePatternChange = (pattern) => {
    setBackgroundPattern(pattern);
    setIsPatternPickerVisible(false);
  };

  const renderPattern = () => {
    if (!backgroundPattern || backgroundPattern === PATTERN_TYPES.NONE)
      return null;

    const patternStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.2,
    };

    switch (backgroundPattern) {
      case PATTERN_TYPES.GRID:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={[styles.gridLine, { top: `${i * 5}%` }]}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={[
                  styles.gridLine,
                  { left: `${i * 5}%`, transform: [{ rotate: "90deg" }] },
                ]}
              />
            ))}
          </View>
        );
      case PATTERN_TYPES.DOTS:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 100 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}
              />
            ))}
          </View>
        );
      case PATTERN_TYPES.LINES:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.line,
                  {
                    transform: [{ rotate: `${i * 18}deg` }],
                    backgroundColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}
              />
            ))}
          </View>
        );
      case PATTERN_TYPES.CIRCLES:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 50 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.circle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}
              />
            ))}
          </View>
        );
      case PATTERN_TYPES.SQUARES:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.square,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}
              />
            ))}
          </View>
        );
      case PATTERN_TYPES.TRIANGLES:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.triangle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    borderBottomColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}
              />
            ))}
          </View>
        );
      case PATTERN_TYPES.STARS:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                />
              </View>
            ))}
          </View>
        );
      case PATTERN_TYPES.HEARTS:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.heart,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="heart"
                  size={20}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                />
              </View>
            ))}
          </View>
        );
      case PATTERN_TYPES.CLOUDS:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.cloud,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="weather-cloudy"
                  size={30}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                />
              </View>
            ))}
          </View>
        );
      case PATTERN_TYPES.FLOWERS:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 25 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.flower,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="flower"
                  size={25}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                />
              </View>
            ))}
          </View>
        );
      case PATTERN_TYPES.BUTTERFLIES:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.butterfly,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="butterfly"
                  size={25}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                />
              </View>
            ))}
          </View>
        );
      case PATTERN_TYPES.RAINBOW:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.rainbow,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="rainbow"
                  size={30}
                  color={colors[Math.floor(Math.random() * colors.length)]}
                />
              </View>
            ))}
          </View>
        );
      case PATTERN_TYPES.BUBBLES:
        return (
          <View style={[patternStyle, { backgroundColor: "transparent" }]}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor:
                      colors[Math.floor(Math.random() * colors.length)],
                  },
                ]}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const renderPath = (path, index) => {
    if (path.points.length < 2) return null;

    switch (path.type) {
      case SHAPE_TYPES.LINE:
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: path.points[0].x,
                top: path.points[0].y,
                width: Math.sqrt(
                  Math.pow(path.points[1].x - path.points[0].x, 2) +
                    Math.pow(path.points[1].y - path.points[0].y, 2)
                ),
                height: path.size,
                backgroundColor: path.color,
                opacity: path.opacity || 1,
                transform: [
                  {
                    rotate: `${Math.atan2(
                      path.points[1].y - path.points[0].y,
                      path.points[1].x - path.points[0].x
                    )}rad`,
                  },
                ],
                transformOrigin: "0 0",
              }}
            />
          </View>
        );

      case SHAPE_TYPES.RECTANGLE:
        const minX = Math.min(path.points[0].x, path.points[2].x);
        const minY = Math.min(path.points[0].y, path.points[2].y);
        const width = Math.abs(path.points[2].x - path.points[0].x);
        const height = Math.abs(path.points[2].y - path.points[0].y);
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: minX,
              top: minY,
              width: width,
              height: height,
              borderWidth: path.size,
              borderColor: path.color,
            }}
          />
        );

      case SHAPE_TYPES.CIRCLE:
        const centerX = path.points[0].x;
        const centerY = path.points[0].y;
        const radius = Math.sqrt(
          Math.pow(path.points[1].x - centerX, 2) +
            Math.pow(path.points[1].y - centerY, 2)
        );
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: centerX - radius,
              top: centerY - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              borderWidth: path.size,
              borderColor: path.color,
            }}
          />
        );

      case SHAPE_TYPES.TRIANGLE:
        const triangleCenterX = path.points[0].x;
        const triangleCenterY = path.points[0].y;
        const triangleRadius = Math.sqrt(
          Math.pow(path.points[1].x - triangleCenterX, 2) +
            Math.pow(path.points[1].y - triangleCenterY, 2)
        );

        const trianglePoints = [];
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          const x = triangleCenterX + triangleRadius * Math.cos(angle);
          const y = triangleCenterY + triangleRadius * Math.sin(angle);
          trianglePoints.push({ x, y });
        }

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {trianglePoints.map((point, i) => {
              const nextPoint = trianglePoints[(i + 1) % trianglePoints.length];
              return (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: point.x,
                    top: point.y,
                    width: Math.sqrt(
                      Math.pow(nextPoint.x - point.x, 2) +
                        Math.pow(nextPoint.y - point.y, 2)
                    ),
                    height: path.size,
                    backgroundColor: path.color,
                    opacity: path.opacity || 1,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "0 0",
                  }}
                />
              );
            })}
          </View>
        );

      case SHAPE_TYPES.STAR:
        const starCenterX = path.points[0].x;
        const starCenterY = path.points[0].y;
        const starRadius = Math.sqrt(
          Math.pow(path.points[1].x - starCenterX, 2) +
            Math.pow(path.points[1].y - starCenterY, 2)
        );

        const starPoints = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * 2 * Math.PI) / 10;
          const radius = i % 2 === 0 ? starRadius : starRadius / 2;
          const x = starCenterX + radius * Math.cos(angle);
          const y = starCenterY + radius * Math.sin(angle);
          starPoints.push({ x, y });
        }

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {starPoints.map((point, i) => {
              const nextPoint = starPoints[(i + 1) % starPoints.length];
              return (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: point.x,
                    top: point.y,
                    width: Math.sqrt(
                      Math.pow(nextPoint.x - point.x, 2) +
                        Math.pow(nextPoint.y - point.y, 2)
                    ),
                    height: path.size,
                    backgroundColor: path.color,
                    opacity: path.opacity || 1,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "0 0",
                  }}
                />
              );
            })}
          </View>
        );

      case SHAPE_TYPES.HEART:
        const heartCenterX = path.points[0].x;
        const heartCenterY = path.points[0].y;
        const heartRadius = Math.sqrt(
          Math.pow(path.points[1].x - heartCenterX, 2) +
            Math.pow(path.points[1].y - heartCenterY, 2)
        );

        const heartPoints = [];
        for (let i = 0; i < 20; i++) {
          const t = (i * Math.PI) / 10;
          const x = heartCenterX + heartRadius * 16 * Math.pow(Math.sin(t), 3);
          const y =
            heartCenterY -
            heartRadius *
              (13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t));
          heartPoints.push({ x, y });
        }

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {heartPoints.map((point, i) => {
              const nextPoint = heartPoints[(i + 1) % heartPoints.length];
              return (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: point.x,
                    top: point.y,
                    width: Math.sqrt(
                      Math.pow(nextPoint.x - point.x, 2) +
                        Math.pow(nextPoint.y - point.y, 2)
                    ),
                    height: path.size,
                    backgroundColor: path.color,
                    opacity: path.opacity || 1,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "0 0",
                  }}
                />
              );
            })}
          </View>
        );

      case SHAPE_TYPES.PENTAGON:
        const pentagonCenterX = path.points[0].x;
        const pentagonCenterY = path.points[0].y;
        const pentagonRadius = Math.sqrt(
          Math.pow(path.points[1].x - pentagonCenterX, 2) +
            Math.pow(path.points[1].y - pentagonCenterY, 2)
        );

        const pentagonPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x = pentagonCenterX + pentagonRadius * Math.cos(angle);
          const y = pentagonCenterY + pentagonRadius * Math.sin(angle);
          pentagonPoints.push({ x, y });
        }

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {pentagonPoints.map((point, i) => {
              const nextPoint = pentagonPoints[(i + 1) % pentagonPoints.length];
              return (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: point.x,
                    top: point.y,
                    width: Math.sqrt(
                      Math.pow(nextPoint.x - point.x, 2) +
                        Math.pow(nextPoint.y - point.y, 2)
                    ),
                    height: path.size,
                    backgroundColor: path.color,
                    opacity: path.opacity || 1,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "0 0",
                  }}
                />
              );
            })}
          </View>
        );

      default:
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {path.points.map((point, i) => {
              if (i === path.points.length - 1) return null;
              const nextPoint = path.points[i + 1];
              return (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: point.x,
                    top: point.y,
                    width: Math.sqrt(
                      Math.pow(nextPoint.x - point.x, 2) +
                        Math.pow(nextPoint.y - point.y, 2)
                    ),
                    height: path.size,
                    backgroundColor: path.color,
                    opacity: path.opacity || 1,
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "0 0",
                    opacity:
                      path.type === BRUSH_TYPES.SPRAY ? 0.5 : path.opacity || 1,
                  }}
                />
              );
            })}
          </View>
        );
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Çizim Yap</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.actionButton, isEraser && styles.activeTool]}
            onPress={() => setIsEraser(!isEraser)}
          >
            <MaterialCommunityIcons name="eraser" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleUndo}>
            <MaterialCommunityIcons name="undo" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleRedo}>
            <MaterialCommunityIcons name="redo" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setIsModalVisible(true)}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <ViewShot
          ref={viewShotRef}
          style={[styles.canvas, { backgroundColor }]}
          options={{
            format: "png",
            quality: 1,
            result: "base64",
          }}
        >
          {renderPattern()}
          <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill}>
            {paths.map((path, index) => renderPath(path, index))}
            {currentPath.length > 0 &&
              renderPath(
                {
                  points: currentPath,
                  color: isEraser ? "#FFFFFF" : currentColor,
                  size: brushSize,
                  type: shapeType || brushType,
                  opacity: opacity,
                },
                "current"
              )}
          </View>
        </ViewShot>
      </View>

      <View style={styles.bottomTools}>
        <View style={styles.toolSection}>
          <View style={styles.brushTypes}>
            <TouchableOpacity
              style={[
                styles.brushTypeButton,
                styles.penButton,
                brushType === BRUSH_TYPES.PEN && styles.activeTool,
              ]}
              onPress={() => {
                setBrushType(BRUSH_TYPES.PEN);
                setShapeType(null);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.brushTypeButton,
                styles.brushButton,
                brushType === BRUSH_TYPES.BRUSH && styles.activeTool,
              ]}
              onPress={() => {
                setBrushType(BRUSH_TYPES.BRUSH);
                setShapeType(null);
              }}
            >
              <MaterialCommunityIcons name="brush" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.brushTypeButton,
                styles.markerButton,
                brushType === BRUSH_TYPES.MARKER && styles.activeTool,
              ]}
              onPress={() => {
                setBrushType(BRUSH_TYPES.MARKER);
                setShapeType(null);
              }}
            >
              <MaterialCommunityIcons name="marker" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.brushTypeButton,
                styles.sprayButton,
                brushType === BRUSH_TYPES.SPRAY && styles.activeTool,
              ]}
              onPress={() => {
                setBrushType(BRUSH_TYPES.SPRAY);
                setShapeType(null);
              }}
            >
              <MaterialCommunityIcons name="spray" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.shapeButton,
              isShapePickerVisible && styles.activeTool,
            ]}
            onPress={() => setIsShapePickerVisible(!isShapePickerVisible)}
          >
            <MaterialCommunityIcons name="shape" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.brushSizeButton,
              isBrushSizePickerVisible && styles.activeTool,
            ]}
            onPress={() =>
              setIsBrushSizePickerVisible(!isBrushSizePickerVisible)
            }
          >
            <MaterialCommunityIcons
              name="format-line-weight"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.colorButton,
              isColorPickerVisible && styles.activeTool,
            ]}
            onPress={() => setIsColorPickerVisible(!isColorPickerVisible)}
          >
            <MaterialCommunityIcons name="palette" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.fillButton,
              isBackgroundPickerVisible && styles.activeTool,
            ]}
            onPress={() =>
              setIsBackgroundPickerVisible(!isBackgroundPickerVisible)
            }
          >
            <MaterialCommunityIcons
              name="format-color-fill"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.patternButton,
              isPatternPickerVisible && styles.activeTool,
            ]}
            onPress={() => setIsPatternPickerVisible(!isPatternPickerVisible)}
          >
            <MaterialCommunityIcons name="texture" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isOpacityPickerVisible && styles.activeTool,
            ]}
            onPress={() => setIsOpacityPickerVisible(!isOpacityPickerVisible)}
          >
            <MaterialCommunityIcons name="opacity" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Çizimi Kaydet</Text>
            <TextInput
              style={styles.input}
              placeholder="Çiziminize bir isim verin"
              value={drawingName}
              onChangeText={setDrawingName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setDrawingName("");
                }}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveDrawing}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isBackgroundPickerVisible && (
        <View style={styles.colorPickerContainer}>
          <View style={styles.colorPalette}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColor,
                ]}
                onPress={() => handleBackgroundColorChange(color)}
              />
            ))}
          </View>
        </View>
      )}

      {isPatternPickerVisible && (
        <View style={styles.patternPickerContainer}>
          <View style={styles.patternGrid}>
            {Object.entries(PATTERN_TYPES).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.patternButton,
                  backgroundPattern === value && styles.selectedPattern,
                ]}
                onPress={() => handlePatternChange(value)}
              >
                {value === PATTERN_TYPES.NONE ? (
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                ) : value === PATTERN_TYPES.GRID ? (
                  <View style={styles.patternPreview}>
                    <View style={[styles.previewLine, { top: 20 }]} />
                    <View
                      style={[
                        styles.previewLine,
                        { left: 20, transform: [{ rotate: "90deg" }] },
                      ]}
                    />
                  </View>
                ) : value === PATTERN_TYPES.DOTS ? (
                  <View style={styles.patternPreview}>
                    <View style={[styles.previewDot, { left: 10, top: 10 }]} />
                    <View style={[styles.previewDot, { left: 20, top: 20 }]} />
                    <View style={[styles.previewDot, { left: 30, top: 10 }]} />
                  </View>
                ) : value === PATTERN_TYPES.LINES ? (
                  <View style={styles.patternPreview}>
                    <View
                      style={[
                        styles.previewLine,
                        { left: 5, top: 20, transform: [{ rotate: "45deg" }] },
                      ]}
                    />
                    <View
                      style={[
                        styles.previewLine,
                        { left: 5, top: 20, transform: [{ rotate: "-45deg" }] },
                      ]}
                    />
                  </View>
                ) : value === PATTERN_TYPES.CIRCLES ? (
                  <View style={styles.patternPreview}>
                    <View
                      style={[styles.previewCircle, { left: 10, top: 10 }]}
                    />
                    <View
                      style={[styles.previewCircle, { left: 20, top: 20 }]}
                    />
                  </View>
                ) : value === PATTERN_TYPES.SQUARES ? (
                  <View style={styles.patternPreview}>
                    <View
                      style={[styles.previewSquare, { left: 10, top: 10 }]}
                    />
                    <View
                      style={[styles.previewSquare, { left: 20, top: 20 }]}
                    />
                  </View>
                ) : value === PATTERN_TYPES.TRIANGLES ? (
                  <View style={styles.patternPreview}>
                    <View
                      style={[styles.previewTriangle, { left: 10, top: 10 }]}
                    />
                    <View
                      style={[styles.previewTriangle, { left: 20, top: 20 }]}
                    />
                  </View>
                ) : value === PATTERN_TYPES.STARS ? (
                  <MaterialCommunityIcons name="star" size={24} color="#fff" />
                ) : value === PATTERN_TYPES.HEARTS ? (
                  <MaterialCommunityIcons name="heart" size={24} color="#fff" />
                ) : value === PATTERN_TYPES.CLOUDS ? (
                  <MaterialCommunityIcons
                    name="weather-cloudy"
                    size={24}
                    color="#fff"
                  />
                ) : value === PATTERN_TYPES.FLOWERS ? (
                  <MaterialCommunityIcons
                    name="flower"
                    size={24}
                    color="#fff"
                  />
                ) : value === PATTERN_TYPES.BUTTERFLIES ? (
                  <MaterialCommunityIcons
                    name="butterfly"
                    size={24}
                    color="#fff"
                  />
                ) : value === PATTERN_TYPES.RAINBOW ? (
                  <MaterialCommunityIcons
                    name="rainbow"
                    size={24}
                    color="#fff"
                  />
                ) : value === PATTERN_TYPES.BUBBLES ? (
                  <View style={styles.patternPreview}>
                    <View
                      style={[styles.previewBubble, { left: 10, top: 10 }]}
                    />
                    <View
                      style={[styles.previewBubble, { left: 20, top: 20 }]}
                    />
                    <View
                      style={[styles.previewBubble, { left: 30, top: 10 }]}
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isShapePickerVisible && (
        <View style={styles.patternPickerContainer}>
          <View style={styles.patternGrid}>
            {Object.entries(SHAPE_TYPES).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.patternButton,
                  shapeType === value && styles.selectedPattern,
                ]}
                onPress={() => {
                  setShapeType(value);
                  setBrushType(null);
                  setIsShapePickerVisible(false);
                }}
              >
                <MaterialCommunityIcons
                  name={getShapeIcon(value)}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isBrushSizePickerVisible && (
        <View style={styles.patternPickerContainer}>
          <View style={styles.patternGrid}>
            {brushSizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.patternButton,
                  brushSize === size && styles.selectedPattern,
                ]}
                onPress={() => {
                  setBrushSize(size);
                  setIsBrushSizePickerVisible(false);
                }}
              >
                <View
                  style={[
                    styles.brushSizeIndicator,
                    { width: size, height: size },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isColorPickerVisible && (
        <View style={styles.patternPickerContainer}>
          <View style={styles.patternGrid}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.patternButton,
                  { backgroundColor: color },
                  currentColor === color && styles.selectedPattern,
                ]}
                onPress={() => {
                  setCurrentColor(color);
                  setIsEraser(false);
                  setIsColorPickerVisible(false);
                }}
              />
            ))}
          </View>
        </View>
      )}

      {isOpacityPickerVisible && (
        <View style={styles.patternPickerContainer}>
          <View style={styles.patternGrid}>
            {opacityLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.patternButton,
                  opacity === level && styles.selectedPattern,
                ]}
                onPress={() => {
                  setOpacity(level);
                  setIsOpacityPickerVisible(false);
                }}
              >
                <View style={styles.opacityPreviewContainer}>
                  <View style={[styles.opacityPreview, { opacity: level }]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </LinearGradient>
  );
}
