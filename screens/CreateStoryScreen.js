import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useVoice } from "../contexts/VoiceContext";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export default function CreateStoryScreen({ route }) {
  const navigation = useNavigation();
  const { isRecording, startRecording, stopRecording, recordedAudio } =
    useVoice();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [drawing, setDrawing] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    color: "#000000",
    fontSize: 16,
    align: "left",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecordingStory, setIsRecordingStory] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [model, setModel] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  const categories = [
    { id: 1, name: "Hayvanlar", icon: "paw", color: "#4CAF50" },
    { id: 2, name: "Doğa", icon: "tree", color: "#4CAF50" },
    { id: 3, name: "Uzay", icon: "star", color: "#2196F3" },
    { id: 4, name: "Spor", icon: "basketball", color: "#FF5722" },
    { id: 5, name: "Arkadaşlık", icon: "account-group", color: "#FFC107" },
    { id: 6, name: "Aile", icon: "home-heart", color: "#E91E63" },
    { id: 7, name: "Okul", icon: "school", color: "#795548" },
    { id: 8, name: "Müzik", icon: "music", color: "#9C27B0" },
    { id: 9, name: "Sanat", icon: "palette", color: "#FFC107" },
    { id: 10, name: "Masal", icon: "book-open-variant", color: "#FF5722" },
    { id: 11, name: "Oyun", icon: "gamepad-variant", color: "#2196F3" },
    { id: 12, name: "Hayal Gücü", icon: "lightbulb", color: "#FFC107" },
    { id: 13, name: "Bilim", icon: "flask", color: "#2196F3" },
    { id: 14, name: "Macera", icon: "sword", color: "#FF5722" },
    { id: 15, name: "Fantastik", icon: "castle", color: "#9C27B0" },
  ];

  useEffect(() => {
    if (route?.params?.drawingData) {
      setDrawing({
        imageData: route.params.drawingData,
        name: route.params.drawingName || "İsimsiz Çizim",
      });
    }
    fetchDrawings();
  }, [route?.params]);

  const fetchDrawings = async () => {
    try {
      const q = query(
        collection(db, "drawings"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const drawingsList = [];
      querySnapshot.forEach((doc) => {
        drawingsList.push({ id: doc.id, ...doc.data() });
      });
      setDrawings(drawingsList);
    } catch (error) {
      console.error("Çizimler yüklenirken hata:", error);
      Alert.alert("Hata", "Çizimler yüklenirken bir hata oluştu");
    }
  };

  const handleDeleteDrawing = async (drawingId) => {
    Alert.alert("Çizimi Sil", "Bu çizimi silmek istediğinizden emin misiniz?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const drawingRef = doc(db, "drawings", drawingId);
            await deleteDoc(drawingRef);
            setDrawings(drawings.filter((d) => d.id !== drawingId));
            Alert.alert("Başarılı", "Çizim silindi");
          } catch (error) {
            console.error("Silme hatası:", error);
            Alert.alert("Hata", "Çizim silinirken bir hata oluştu");
          }
        },
      },
    ]);
  };

  const handleUseDrawing = (drawing) => {
    console.log("Seçilen çizim:", drawing);
    setSelectedDrawing(drawing);
    Alert.alert(
      "Çizim Seçildi",
      `${drawing.name} çizimini hikayenizde kullanmak istiyor musunuz?`,
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Kullan",
          onPress: () => {
            console.log("Çizim kullanılıyor:", drawing);
            const drawingData = {
              imageData: drawing.imageData,
              name: drawing.name,
            };
            console.log("Oluşturulan drawingData:", drawingData);
            setDrawing(drawingData);
            setTitle(drawing.name);
            analyzeImage(drawingData);
            Alert.alert("Başarılı", "Çizim hikayenize eklendi");
          },
        },
      ]
    );
  };

  const renderDrawingItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.drawingItem,
        selectedDrawing?.id === item.id && styles.selectedDrawing,
      ]}
    >
      <Image
        source={{
          uri: item.imageData.startsWith("data:image")
            ? item.imageData
            : `data:image/png;base64,${item.imageData}`,
        }}
        style={styles.drawingImage}
        resizeMode="cover"
      />
      <Text style={styles.drawingName} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.drawingButtons}>
        <TouchableOpacity
          style={[styles.drawingButton, styles.deleteButton]}
          onPress={() => handleDeleteDrawing(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.drawingButton, styles.useButton]}
          onPress={() => handleUseDrawing(item)}
        >
          <MaterialCommunityIcons name="check" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleTextStyleChange = (style, value) => {
    setTextStyle((prev) => ({
      ...prev,
      [style]: value,
    }));
  };

  const handleSaveStory = async () => {
    if (!title || !category || !content) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Kullanıcı bilgilerini al
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      let drawingData = null;
      if (selectedDrawing) {
        // Resim verisi formatını standardize et
        let imageData = selectedDrawing.imageData;
        if (typeof imageData === "string") {
          if (!imageData.startsWith("data:image")) {
            // Base64 verisini düzgün formata dönüştür
            imageData = `data:image/png;base64,${imageData.replace(/\n/g, "")}`;
          }
        }

        drawingData = {
          imageData: imageData,
          name: selectedDrawing.name,
        };
      }

      const storyData = {
        title,
        category,
        content,
        author: userData?.username || "Kullanıcı",
        userId: user.uid,
        createdAt: new Date(),
        likes: 0,
        comments: [],
        drawing: drawingData,
        audio: recordedAudio,
        hasAudio: !!recordedAudio,
      };

      await addDoc(collection(db, "stories"), storyData);
      Alert.alert("Başarılı", "Hikaye başarıyla kaydedildi");
      navigation.goBack();
    } catch (error) {
      console.error("Hikaye kaydedilirken hata:", error);
      Alert.alert("Hata", "Hikaye kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory.name);
    setIsCategoryModalVisible(false);
  };

  const renderTextTools = () => (
    <View style={styles.textToolsContainer}>
      <TouchableOpacity
        style={[styles.textToolButton, textStyle.bold && styles.activeTool]}
        onPress={() => handleTextStyleChange("bold", !textStyle.bold)}
      >
        <MaterialCommunityIcons name="format-bold" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.textToolButton, textStyle.italic && styles.activeTool]}
        onPress={() => handleTextStyleChange("italic", !textStyle.italic)}
      >
        <MaterialCommunityIcons name="format-italic" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.textToolButton,
          textStyle.align === "left" && styles.activeTool,
        ]}
        onPress={() => handleTextStyleChange("align", "left")}
      >
        <MaterialCommunityIcons
          name="format-align-left"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.textToolButton,
          textStyle.align === "center" && styles.activeTool,
        ]}
        onPress={() => handleTextStyleChange("align", "center")}
      >
        <MaterialCommunityIcons
          name="format-align-center"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.textToolButton,
          textStyle.align === "right" && styles.activeTool,
        ]}
        onPress={() => handleTextStyleChange("align", "right")}
      >
        <MaterialCommunityIcons
          name="format-align-right"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  const filteredDrawings = drawings.filter((drawing) => {
    const query = searchQuery?.toLowerCase() || "";
    const name = drawing.name?.toLowerCase() || "";
    return name.includes(query);
  });

  const filteredCategories = categories.filter((category) => {
    const query = searchQuery?.toLowerCase() || "";
    const name = category.name?.toLowerCase() || "";
    return name.includes(query);
  });

  const handleRecordStory = () => {
    if (isRecordingStory) {
      stopRecording();
      setIsRecordingStory(false);
    } else {
      startRecording();
      setIsRecordingStory(true);
    }
  };

  const renderVoiceControls = () => (
    <View style={styles.voiceControls}>
      <TouchableOpacity
        style={[styles.voiceButton, isRecordingStory && styles.recordingButton]}
        onPress={handleRecordStory}
      >
        <MaterialCommunityIcons
          name={isRecordingStory ? "stop" : "microphone"}
          size={24}
          color={isRecordingStory ? "#ff4444" : "#4CAF50"}
        />
        <Text style={styles.voiceButtonText}>
          {isRecordingStory ? "Kaydı Durdur" : "Sesli Hikaye Kaydet"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // TensorFlow modelini yükle
  useEffect(() => {
    const setupTensorFlow = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("TensorFlow modeli yüklendi");
      } catch (error) {
        console.error("TensorFlow yüklenirken hata:", error);
      }
    };
    setupTensorFlow();
  }, []);

  // Çizim analizi fonksiyonu
  const analyzeImage = async (imageData) => {
    if (!model) {
      Alert.alert(
        "Hata",
        "Yapay zeka modeli henüz hazır değil, lütfen bekleyin..."
      );
      return;
    }

    if (!imageData) {
      console.error("Görüntü verisi bulunamadı");
      setImageAnalysis("Görüntü verisi bulunamadı. Lütfen tekrar deneyin.");
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log("Analiz başlıyor...");

      // Base64 görüntüyü düzgün formata getir
      let imageUri;
      if (typeof imageData === "string") {
        imageUri = imageData.startsWith("data:image")
          ? imageData
          : `data:image/png;base64,${imageData}`;
      } else if (imageData.imageData) {
        imageUri = imageData.imageData.startsWith("data:image")
          ? imageData.imageData
          : `data:image/png;base64,${imageData.imageData}`;
      } else {
        throw new Error("Geçersiz görüntü verisi formatı");
      }

      // Base64'ü binary veriye dönüştür
      const base64Data = imageUri.split(",")[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      // Görüntüyü 224x224 boyutunda tensor'a dönüştür
      const targetSize = 224;
      const numChannels = 3; // RGB için
      const numPixels = targetSize * targetSize * numChannels;

      // Yeni bir Uint8Array oluştur ve verileri kopyala
      const imageDataArray = new Uint8Array(numPixels);
      for (let i = 0; i < numPixels; i++) {
        imageDataArray[i] = bytes[i % bytes.length];
      }

      // Tensor oluştur
      const imgTensor = tf.tensor3d(imageDataArray, [
        targetSize,
        targetSize,
        numChannels,
      ]);

      // Görüntüyü normalize et
      const normalized = imgTensor.div(255.0);

      // Yapay zeka ile tahmin yap
      const predictions = await model.classify(normalized);
      console.log("Ham tahminler:", predictions);

      // Çocuk çizimleri için özel kategoriler
      const childDrawingCategories = {
        house: {
          keywords: [
            "house",
            "building",
            "home",
            "cottage",
            "roof",
            "window",
            "door",
            "wall",
            "chimney",
            "fence",
            "garden",
            "room",
            "bedroom",
            "kitchen",
            "bathroom",
            "living room",
            "apartment",
            "castle",
            "palace",
            "tower",
            "bridge",
          ],
          description: "Ev çizimi",
          analysis:
            "Çocuğunuz güvenli bir yuva ve aile kavramını çizmiş. Bu, güvenlik ve sıcaklık hissini yansıtıyor.",
        },
        family: {
          keywords: [
            "person",
            "people",
            "human",
            "face",
            "portrait",
            "head",
            "body",
            "arm",
            "leg",
            "family",
            "child",
            "adult",
            "boy",
            "girl",
            "man",
            "woman",
            "baby",
            "mother",
            "father",
            "sister",
            "brother",
            "grandma",
            "grandpa",
            "friend",
            "teacher",
            "doctor",
            "nurse",
            "police",
            "fireman",
          ],
          description: "Aile/İnsan çizimi",
          analysis:
            "Çocuğunuz insan figürleri çizmiş. Bu, sosyal ilişkileri ve duygusal bağları ifade ediyor.",
        },
        nature: {
          keywords: [
            "tree",
            "flower",
            "plant",
            "grass",
            "sun",
            "mountain",
            "river",
            "sea",
            "beach",
            "garden",
            "park",
            "forest",
            "leaf",
            "branch",
            "sky",
            "cloud",
            "rainbow",
            "rain",
            "snow",
            "wind",
            "storm",
            "lightning",
            "star",
            "moon",
            "planet",
            "space",
            "galaxy",
            "universe",
            "earth",
            "world",
            "country",
            "city",
            "village",
          ],
          description: "Doğa çizimi",
          analysis:
            "Çocuğunuz doğa elementleri çizmiş. Bu, çevreye olan ilgiyi ve doğa sevgisini gösteriyor.",
        },
        animal: {
          keywords: [
            "animal",
            "bird",
            "dog",
            "cat",
            "pet",
            "fish",
            "bear",
            "lion",
            "tiger",
            "elephant",
            "monkey",
            "rabbit",
            "mouse",
            "snake",
            "butterfly",
            "dragon",
            "dinosaur",
            "cow",
            "horse",
            "sheep",
            "pig",
            "chicken",
            "duck",
            "goose",
            "turkey",
            "owl",
            "eagle",
            "hawk",
            "parrot",
            "penguin",
            "dolphin",
            "whale",
            "shark",
            "octopus",
            "crab",
            "lobster",
            "turtle",
            "frog",
            "lizard",
            "spider",
            "ant",
            "bee",
            "mosquito",
            "fly",
          ],
          description: "Hayvan çizimi",
          analysis:
            "Çocuğunuz hayvan figürleri çizmiş. Bu, canlılara olan ilgiyi ve sevgiyi yansıtıyor.",
        },
        vehicle: {
          keywords: [
            "car",
            "truck",
            "vehicle",
            "transport",
            "bus",
            "train",
            "plane",
            "boat",
            "ship",
            "bicycle",
            "motorcycle",
            "wheel",
            "rocket",
            "spaceship",
            "helicopter",
            "taxi",
            "ambulance",
            "fire truck",
            "police car",
            "tractor",
            "crane",
            "bulldozer",
            "excavator",
            "tank",
            "submarine",
            "sailboat",
            "canoe",
            "kayak",
            "surfboard",
            "skateboard",
            "roller skates",
            "scooter",
            "tram",
            "subway",
            "metro",
            "trolley",
            "cable car",
            "gondola",
            "hot air balloon",
            "parachute",
            "jet",
            "fighter jet",
            "airplane",
            "aircraft",
            "glider",
            "drone",
          ],
          description: "Araç çizimi",
          analysis:
            "Çocuğunuz araç figürleri çizmiş. Bu, hareket ve keşif merakını gösteriyor.",
        },
        abstract: {
          keywords: [
            "abstract",
            "pattern",
            "shape",
            "design",
            "color",
            "line",
            "circle",
            "square",
            "triangle",
            "rectangle",
            "diamond",
            "star",
            "heart",
            "spiral",
            "zigzag",
            "wave",
            "curve",
            "dot",
            "point",
            "spot",
            "stripe",
            "check",
            "grid",
            "mesh",
            "net",
            "web",
            "lattice",
            "fence",
            "gate",
            "door",
            "window",
            "hole",
            "gap",
            "space",
            "area",
            "zone",
            "region",
            "section",
            "part",
            "piece",
            "bit",
            "fragment",
            "portion",
            "segment",
            "slice",
            "chunk",
            "block",
            "cube",
            "sphere",
            "cylinder",
            "cone",
            "pyramid",
            "prism",
            "polygon",
            "pentagon",
            "hexagon",
            "octagon",
            "oval",
            "ellipse",
            "crescent",
            "arc",
            "bow",
            "loop",
            "ring",
            "hoop",
            "band",
            "strip",
            "ribbon",
            "string",
            "rope",
            "chain",
            "link",
            "knot",
            "tie",
            "bow",
            "fold",
            "crease",
            "wrinkle",
            "crack",
            "split",
            "break",
            "tear",
            "rip",
            "hole",
            "gap",
            "space",
            "void",
            "empty",
            "full",
            "solid",
            "hollow",
            "transparent",
            "opaque",
            "clear",
            "cloudy",
            "foggy",
            "misty",
            "hazy",
            "blurry",
            "sharp",
            "focused",
            "blurred",
            "distorted",
            "twisted",
            "bent",
            "curved",
            "straight",
            "flat",
            "smooth",
            "rough",
            "bumpy",
            "lumpy",
            "jagged",
            "spiky",
            "pointy",
            "sharp",
            "dull",
            "round",
            "square",
            "triangular",
            "rectangular",
            "circular",
            "oval",
            "elliptical",
            "spherical",
            "cylindrical",
            "conical",
            "pyramidal",
            "prismatic",
            "polygonal",
            "pentagonal",
            "hexagonal",
            "octagonal",
          ],
          description: "Soyut çizim",
          analysis:
            "Çocuğunuz soyut şekiller çizmiş. Bu, yaratıcı düşünce ve hayal gücünü yansıtıyor.",
        },
      };

      // Analiz sonucunu oluştur
      let analysis = "🎨 Yapay Zeka Analizi\n\n";

      // Çizim türünü belirle
      let mainCategory = "abstract"; // Varsayılan olarak soyut çizim
      let maxScore = 0;
      let matchedKeywords = [];

      // Her kategori için puan hesapla
      for (const [category, data] of Object.entries(childDrawingCategories)) {
        let score = 0;
        let matchCount = 0;
        let categoryMatches = [];

        // Çizim ismini analiz et
        const drawingName = selectedDrawing?.name?.toLowerCase() || "";
        for (const keyword of data.keywords) {
          if (drawingName.includes(keyword)) {
            score += 2.0; // İsim eşleşmesi için çok daha yüksek bonus puan
            matchCount++;
            categoryMatches.push(keyword);
          }
        }

        // Model tahminlerini analiz et (daha düşük ağırlık)
        for (const prediction of predictions) {
          const className = prediction.className.toLowerCase();
          for (const keyword of data.keywords) {
            if (className.includes(keyword)) {
              score += prediction.probability * 0.5; // Tahmin eşleşmesi için daha düşük ağırlık
              matchCount++;
              categoryMatches.push(keyword);
            }
          }
        }

        if (matchCount > 0) {
          score *= 1 + matchCount * 0.2; // Daha az bonus
          if (score > maxScore) {
            maxScore = score;
            mainCategory = category;
            matchedKeywords = categoryMatches;
          }
        }
      }

      const category = childDrawingCategories[mainCategory];
      analysis += `📝 Çizim Türü: ${category.description}\n\n`;
      analysis += `💭 Psikolojik Analiz:\n${category.analysis}\n\n`;

      // Çizim isminden tespit edilen özellikleri ekle
      if (selectedDrawing?.name) {
        const nameKeywords = selectedDrawing.name.toLowerCase().split(/\s+/);
        const uniqueKeywords = [...new Set(nameKeywords)];
        const nameMatches = uniqueKeywords.filter((keyword) =>
          Object.values(childDrawingCategories).some((cat) =>
            cat.keywords.some((k) => k.includes(keyword) || keyword.includes(k))
          )
        );

        if (nameMatches.length > 0) {
          analysis += `📌 Çizim İsminden Tespit Edilenler:\n`;
          nameMatches.forEach((keyword) => {
            analysis += `• ${keyword}\n`;
          });
        }
      }

      // Eşleşen anahtar kelimeleri göster (sadece çizim isminde olmayanlar)
      const uniqueMatches = [...new Set(matchedKeywords)].filter(
        (keyword) => !selectedDrawing?.name?.toLowerCase().includes(keyword)
      );

      if (uniqueMatches.length > 0) {
        analysis += `\n🔍 Model Tahminleri:\n`;
        uniqueMatches.forEach((keyword, index) => {
          const emojis = ["✨", "🌟", "💫", "⭐", "🔍"];
          analysis += `${emojis[index % emojis.length]} ${keyword}\n`;
        });
      }

      console.log("Analiz tamamlandı");
      setImageAnalysis(analysis);
      setIsAnalyzing(false);

      // Tensor'ları temizle
      tf.dispose([imgTensor, normalized]);
    } catch (error) {
      console.error("Görüntü analizi sırasında hata:", error);
      setImageAnalysis(
        "Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hikaye Oluştur</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Çizimler Bölümü */}
        <View style={styles.drawingsContainer}>
          <View style={styles.drawingsHeader}>
            <Text style={styles.drawingsTitle}>Çizimlerim</Text>
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color="#fff"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Çizim ara..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                color="#fff"
              />
            </View>
          </View>
          <FlatList
            data={filteredDrawings}
            renderItem={renderDrawingItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        </View>

        {/* Seçilen Çizim Önizleme */}
        {selectedDrawing && (
          <View style={styles.selectedDrawingPreviewContainer}>
            <Image
              source={{
                uri: selectedDrawing.imageData.startsWith("data:image")
                  ? selectedDrawing.imageData
                  : `data:image/png;base64,${selectedDrawing.imageData}`,
              }}
              style={styles.selectedDrawingPreviewImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.deleteSelectedDrawingButton}
              onPress={() => {
                setSelectedDrawing(null);
                setImageAnalysis(null);
              }}
            >
              <MaterialCommunityIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Analiz Sonucu */}
        {selectedDrawing &&
          (isAnalyzing ? (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisText}>Çizim analiz ediliyor...</Text>
            </View>
          ) : imageAnalysis ? (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisText}>{imageAnalysis}</Text>
            </View>
          ) : null)}

        {/* Hikaye Oluşturma Formu */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Başlık</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Hikayenize bir başlık verin"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              color="#fff"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kategori</Text>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Text style={styles.categoryButtonText}>
                {category || "Kategori Seçin"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hikaye İçeriği</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={content}
              onChangeText={setContent}
              placeholder="Hikayenizi yazın..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              color="#fff"
            />
          </View>

          {/* Sesli Hikaye Kontrolleri */}
          {renderVoiceControls()}

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveStory}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Kaydediliyor..." : "Hikayeyi Kaydet"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Kategori Seçim Modalı */}
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kategori Seçin</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredCategories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.categoryItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Modal>
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#424242",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    width: "100%",
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  drawingsContainer: {
    marginBottom: 20,
  },
  drawingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  drawingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 0,
    width: "30%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    width: "65%",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  listContainer: {
    padding: 4,
  },
  drawingItem: {
    flex: 1,
    margin: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    overflow: "hidden",
    aspectRatio: 1,
    maxWidth: "30%",
  },
  drawingImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  drawingName: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    padding: 4,
    fontSize: 10,
    textAlign: "center",
  },
  drawingPreview: {
    marginBottom: 20,
  },
  drawingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  drawingButtons: {
    position: "absolute",
    top: 4,
    right: 4,
    flexDirection: "row",
    gap: 4,
  },
  drawingButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "rgba(255,0,0,0.7)",
  },
  useButton: {
    backgroundColor: "rgba(0,255,0,0.7)",
  },
  selectedDrawing: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  selectedDrawingContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 15,
    alignItems: "stretch",
  },
  selectedDrawingPreview: {
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 0,
  },
  previewText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 0,
    textAlign: "left",
    width: "100%",
  },
  previewImageContainer: {
    position: "relative",
    width: "100%",
    flex: 1,
  },
  previewButtons: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
  previewButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    marginTop: 0,
    backgroundColor: "transparent",
  },
  formContainer: {
    marginTop: 20,
  },
  textToolsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginBottom: 10,
  },
  textToolButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  activeTool: {
    backgroundColor: "#4CAF50",
  },
  contentInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#424242",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    width: "100%",
    height: 200,
    textAlignVertical: "top",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 3,
    borderColor: "#E0E0E0",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
  },
  modalTitle: {
    color: "#424242",
    fontSize: 24,
    fontWeight: "bold",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  categoryItem: {
    width: "30%",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  selectedCategory: {
    backgroundColor: "#E0E0E0",
    borderColor: "#9E9E9E",
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  categoryItemText: {
    color: "#424242",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#424242",
    fontWeight: "bold",
  },
  selectedCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
  },
  selectedCategoryIcon: {
    marginRight: 8,
  },
  categoryButton: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    width: "100%",
  },
  categoryButtonText: {
    color: "#424242",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  voiceControls: {
    marginVertical: 10,
    alignItems: "center",
  },
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordingButton: {
    backgroundColor: "#ffebee",
  },
  voiceButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedDrawingPreviewContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 20,
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
  },
  selectedDrawingPreviewImage: {
    width: "100%",
    height: "100%",
  },
  deleteSelectedDrawingButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  analysisContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  analysisText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  analysisResult: {
    color: "#fff",
    fontSize: 12,
  },
});
