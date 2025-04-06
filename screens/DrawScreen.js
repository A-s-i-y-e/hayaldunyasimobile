import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  PanResponder,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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

export default function DrawScreen() {
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isEraser, setIsEraser] = useState(false);
  const [brushType, setBrushType] = useState(BRUSH_TYPES.PEN);
  const [shapeType, setShapeType] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const viewShotRef = useRef();

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
    setPaths((prevPaths) => prevPaths.slice(0, -1));
  };

  const handleClear = () => {
    Alert.alert("Temizle", "Çizimi temizlemek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Temizle", onPress: () => setPaths([]), style: "destructive" },
    ]);
  };

  const handleSave = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Hata", "Çizim kaydedilirken bir hata oluştu.");
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
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          nextPoint.y - point.y,
                          nextPoint.x - point.x
                        )}rad`,
                      },
                    ],
                    transformOrigin: "0 0",
                    opacity: path.type === BRUSH_TYPES.SPRAY ? 0.5 : 1,
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
          <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialCommunityIcons
              name="content-save"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.leftTools}>
          <View style={styles.toolSection}>
            <Text style={styles.toolSectionTitle}>Fırça Stilleri</Text>
            <View style={styles.brushTypes}>
              <TouchableOpacity
                style={[
                  styles.brushTypeButton,
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
            <Text style={styles.toolSectionTitle}>Şekiller</Text>
            <View style={styles.shapes}>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.LINE && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.LINE);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="vector-line"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.RECTANGLE && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.RECTANGLE);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="rectangle-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.CIRCLE && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.CIRCLE);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="circle-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.TRIANGLE && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.TRIANGLE);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="triangle-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.STAR && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.STAR);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="star-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.HEART && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.HEART);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shapeButton,
                  shapeType === SHAPE_TYPES.PENTAGON && styles.activeTool,
                ]}
                onPress={() => {
                  setShapeType(SHAPE_TYPES.PENTAGON);
                  setBrushType(null);
                }}
              >
                <MaterialCommunityIcons
                  name="pentagon-outline"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.toolSection}>
            <Text style={styles.toolSectionTitle}>Kalınlık</Text>
            <View style={styles.brushSizes}>
              {brushSizes.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.brushSizeButton,
                    brushSize === size && styles.selectedBrushSize,
                  ]}
                  onPress={() => setBrushSize(size)}
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

          <View style={styles.toolSection}>
            <View style={styles.colorTitleContainer}>
              <Text style={styles.toolSectionTitle}>Renkler</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={12}
                color="#fff"
                style={styles.arrowIcon}
              />
            </View>
          </View>
        </View>

        <ViewShot ref={viewShotRef} style={styles.canvas}>
          <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill}>
            {paths.map((path, index) => renderPath(path, index))}
            {currentPath.length > 0 &&
              renderPath(
                {
                  points: currentPath,
                  color: isEraser ? "#FFFFFF" : currentColor,
                  size: brushSize,
                  type: shapeType || brushType,
                },
                "current"
              )}
          </View>
        </ViewShot>
      </View>

      <View style={styles.bottomTools}>
        <View style={styles.toolSection}>
          <View style={styles.colorPalette}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  currentColor === color && styles.selectedColor,
                ]}
                onPress={() => {
                  setCurrentColor(color);
                  setIsEraser(false);
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
  },
  leftTools: {
    width: 60,
    padding: 8,
    backgroundColor: "transparent",
    borderRightWidth: 0,
    height: "100%",
    justifyContent: "flex-start",
  },
  rightTools: {
    width: 60,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.1)",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toolSection: {
    marginBottom: 8,
    alignItems: "center",
    flex: 0,
  },
  toolSectionTitle: {
    color: "#fff",
    fontSize: 10,
    marginBottom: 0,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  brushTypes: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    flex: 0,
  },
  shapes: {
    alignItems: "center",
    gap: 8,
    flex: 0,
  },
  brushTypeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  shapeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
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
  colorButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
    margin: 1,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#FFD700",
    transform: [{ scale: 1.1 }],
  },
  brushSizes: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 2,
    marginBottom: 1,
    paddingHorizontal: 5,
    width: "100%",
    flex: 0,
  },
  brushSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 1,
  },
  selectedBrushSize: {
    borderColor: "#FFD700",
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: [{ scale: 1.1 }],
  },
  brushSizeIndicator: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  bottomTools: {
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 10,
    width: "80%",
    alignSelf: "flex-end",
    borderRadius: 8,
  },
  activeTool: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: "#FFD700",
    transform: [{ scale: 1.1 }],
  },
  colorTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrowIcon: {
    marginTop: 0,
  },
});
