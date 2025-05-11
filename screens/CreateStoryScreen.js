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
  const [isAIAnalysisModalVisible, setIsAIAnalysisModalVisible] =
    useState(false);
  const [aiAnalysis, setAIAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [enhancedDrawing, setEnhancedDrawing] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

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

  const handleStorySelect = (story) => {
    // Hikaye içeriğini düzenle
    const formattedStory = story.fullStory
      .replace(/\n\s*\n/g, "\n") // Fazla boş satırları temizle
      .trim(); // Baştaki ve sondaki boşlukları temizle

    setContent(formattedStory);
    setTitle(story.title);

    // Hikaye türüne göre kategori seçimi
    const categoryMapping = {
      Macera: "Macera",
      Aile: "Aile",
      Doğa: "Doğa",
      Fantastik: "Fantastik",
      Bilim: "Bilim",
      Müzik: "Müzik",
      Sanat: "Sanat",
      Spor: "Spor",
      Okul: "Okul",
      Hayvanlar: "Hayvanlar",
      Uzay: "Uzay",
      Masal: "Masal",
      Oyun: "Oyun",
      "Hayal Gücü": "Hayal Gücü",
    };

    setCategory(categoryMapping[story.type] || story.type);
    setIsAIAnalysisModalVisible(false);
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

        // Çizim verilerini kontrol et ve varsayılan değerler ata
        drawingData = {
          imageData: imageData || "",
          name: selectedDrawing.name || "İsimsiz Çizim",
          id: selectedDrawing.id || "",
          createdAt: selectedDrawing.createdAt || new Date(),
        };
      }

      // Hikaye içeriğini düzenle
      const formattedContent = content.replace(/\n\s*\n/g, "\n").trim();

      const storyData = {
        title: title.trim(),
        category: category.trim(),
        content: formattedContent,
        author: userData?.username || "Kullanıcı",
        userId: user.uid,
        createdAt: new Date(),
        likes: 0,
        comments: [],
        drawing: drawingData,
        audio: recordedAudio || null,
        hasAudio: !!recordedAudio,
      };

      // Veriyi kaydetmeden önce kontrol et
      if (drawingData && (!drawingData.imageData || !drawingData.name)) {
        throw new Error("Çizim verileri eksik");
      }

      await addDoc(collection(db, "stories"), storyData);
      Alert.alert("Başarılı", "Hikaye başarıyla kaydedildi");
      navigation.goBack();
    } catch (error) {
      console.error("Hikaye kaydedilirken hata:", error);
      Alert.alert(
        "Hata",
        "Hikaye kaydedilirken bir hata oluştu: " + error.message
      );
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

  const handleAIAnalysis = async () => {
    if (!selectedDrawing) {
      Alert.alert("Uyarı", "Lütfen önce bir çizim seçin");
      return;
    }

    setIsAnalyzing(true);
    setIsAIAnalysisModalVisible(true);

    try {
      setTimeout(() => {
        const analysis = {
          title: "Çizim Analizi",
          description: "Bu çizimde gördüğüm öğeler:",
          elements: ["Güneş", "Ağaçlar", "Ev", "Çiçekler"],
          storyAnalysis: {
            mood: "Neşeli ve huzurlu",
            theme: "Doğa ve aile",
            potentialCharacters: [
              "Küçük bir çocuk",
              "Aile üyeleri",
              "Orman hayvanları",
            ],
            suggestedSettings: [
              "Güneşli bir yaz günü",
              "Orman kenarında bir ev",
              "Çiçekli bir bahçe",
            ],
          },
          storySuggestions: [
            {
              id: 1,
              title: "Ormanın Sırrı",
              type: "Macera",
              description:
                "Güneşli bir günde ormanda geçen bir macera hikayesi",
              outline: [
                "Küçük çocuk ormanda yeni bir yol keşfeder",
                "Yolda farklı hayvanlarla tanışır",
                "Birlikte ormanın sırrını çözerler",
              ],
              keywords: ["macera", "keşif", "arkadaşlık", "doğa"],
              fullStory: `Güneş, ormanın üzerine altın sarısı ışıklarını saçarken, küçük Ali evlerinin arka bahçesindeki ağaçların arasında yeni bir patika keşfetti. Bu patika, daha önce hiç görmediği bir yere gidiyordu.

"Acaba bu yol nereye çıkar?" diye düşündü Ali. Merakına yenik düşerek, patikada ilerlemeye başladı. Yol, onu gittikçe ormanın derinliklerine götürüyordu.

Yürürken, bir sincap ile karşılaştı. Sincap, Ali'yi görünce korkmadı, hatta ona doğru yaklaştı. "Merhaba!" dedi Ali. "Benimle arkadaş olmak ister misin?"

Sincap, Ali'nin omzuna çıktı ve birlikte yürümeye başladılar. Biraz ilerledikten sonra, bir tavşan ile karşılaştılar. Tavşan da onlara katıldı. Üç arkadaş, ormanın derinliklerine doğru ilerlerken, eski bir ağaç kovuğu gördüler.

Kovuğun içinde parlayan bir şey vardı. Ali, kovuğa yaklaştı ve içindeki şeyi aldı. Bu, eski bir anahtardı. Anahtarın üzerinde "Ormanın Kalbi" yazıyordu.

"Bu anahtar ne işe yarar acaba?" diye düşündü Ali. Sincap ve tavşan da merakla anahtara bakıyorlardı. Birlikte ormanın kalbini bulmaya karar verdiler.

Yolculukları sırasında birçok hayvanla tanıştılar ve hepsi onlara yardım etti. Sonunda, ormanın en yaşlı ağacının yanına geldiler. Ağacın gövdesinde bir kapı vardı.

Ali, anahtarı kapıya soktu ve döndürdü. Kapı açıldığında, içeride ormanın tüm hayvanları bir araya gelmiş, bir şenlik düzenliyorlardı. Bu, ormanın en büyük sırrıydı: Tüm hayvanlar birbirleriyle arkadaştı ve her gece burada buluşuyorlardı.

Ali ve yeni arkadaşları, şenliğe katıldılar. O gece, ormanın en güzel gecesi oldu. Ali, artık ormanın bir parçası olduğunu hissetti ve her gün yeni arkadaşlarıyla buluşmaya devam etti.`,
            },
            {
              id: 2,
              title: "Evimiz",
              type: "Aile",
              description: "Doğa ile iç içe yaşayan bir ailenin hikayesi",
              outline: [
                "Aile orman kenarında yaşar",
                "Her gün yeni bir doğa olayına tanık olurlar",
                "Birlikte bahçe bakımı yaparlar",
              ],
              keywords: ["aile", "doğa", "huzur", "birlik"],
              fullStory: `Yaz sabahı, güneş ışıkları pencereden içeri süzülürken, Ayşe'nin ailesi uyanmaya başladı. Onlar, ormanın kenarında, çiçeklerle dolu bir bahçeye sahip evlerinde yaşıyorlardı.

"Günaydın!" dedi anne, kahvaltı masasında. "Bugün bahçede neler yapmak istersiniz?"

"Ben çiçekleri sulayacağım!" dedi Ayşe heyecanla.
"Ben de ağaçları budayacağım," dedi baba.
"Ben de size yardım edeceğim," dedi anne gülümseyerek.

Kahvaltıdan sonra, hep birlikte bahçeye çıktılar. Bahçe, rengârenk çiçeklerle doluydu. Güller, papatyalar, laleler... Her biri kendi güzelliğini sergiliyordu.

Ayşe, çiçekleri sularken, bir kelebek gördü. Kelebek, onun omzuna kondu. "Merhaba!" dedi Ayşe. "Sen de mi bahçemizi beğendin?"

Baba ağaçları budarken, bir sincap ağacın tepesinden onu izliyordu. Sincap, düşen dalları toplayıp yuvasına götürüyordu. "Teşekkür ederim!" dedi sincap, "Bu dallar tam ihtiyacım olan şey!"

Anne, sebze bahçesinde domatesleri toplarken, bir tavşan yavrusu ile karşılaştı. Tavşan, annesinin yanına koştu. "Anne, bu insanlar çok iyi!" dedi.

Öğle vakti, aile bahçedeki masada yemeklerini yerken, tüm hayvanlar onları izliyordu. Kuşlar şarkı söylüyor, arılar çiçeklerden bal topluyor, kelebekler dans ediyordu.

"Bizim evimiz sadece bir ev değil," dedi anne. "Bu, tüm canlıların bir arada yaşadığı bir yuva."

Ayşe, bu sözleri duyunca çok mutlu oldu. Evleri, gerçekten de öyleydi. Ormanın kenarında, doğa ile iç içe, tüm canlılarla birlikte yaşadıkları bir yuva.

Akşam olduğunda, güneş batarken, aile bahçedeki bankta oturup günün güzelliklerini konuştu. Ayşe, o gün öğrendiği en önemli şeyi anladı: Gerçek bir ev, sadece dört duvar değil, içinde yaşayan tüm canlıların mutlu olduğu bir yerdi.`,
            },
            {
              id: 3,
              title: "Baharın Gelişi",
              type: "Doğa",
              description: "Bahar mevsiminde açan çiçeklerin hikayesi",
              outline: [
                "Kış sona erer ve bahar gelir",
                "Çiçekler açmaya başlar",
                "Doğa yeniden canlanır",
              ],
              keywords: ["mevsimler", "çiçekler", "değişim", "yenilenme"],
              fullStory: `Kış, son günlerini yaşıyordu. Kar taneleri yavaşça erirken, toprak altında bir hareketlenme başladı. Çiçek tohumları uyanmaya başlamıştı.

"Uyanma vakti geldi!" dedi küçük lale tohumu.
"Evet, bahar geliyor!" dedi papatya tohumu.
"Ben de uyanmak istiyorum!" dedi gül tohumu.

Tohumlar, toprağın altında birbirleriyle konuşuyordu. Her biri, baharın gelişini bekliyordu. Güneş, her gün biraz daha güçleniyor, toprağı ısıtıyordu.

Bir sabah, lale tohumu ilk filizini verdi. "Bakın! Ben uyandım!" diye bağırdı. Filizi, toprağın üzerine çıktı ve güneşi gördü. "Ne kadar güzel!" dedi.

Papatya tohumu da uyandı. Filizi, lalenin yanında büyümeye başladı. "Merhaba!" dedi laleye. "Birlikte büyüyelim!"

Gül tohumu biraz daha bekledi. O, en son uyanan olmak istiyordu. "Ben de hazırım!" dedi bir sabah. Filizi, diğer çiçeklerin yanında boy gösterdi.

Bahar rüzgârı estiğinde, çiçekler dans etmeye başladı. "Ne güzel bir dans!" dedi lale.
"Evet, baharın dansı!" dedi papatya.
"Ve biz de bu dansın bir parçasıyız!" dedi gül.

Arılar ve kelebekler geldi. Çiçeklerin etrafında uçuşuyorlardı. "Merhaba!" dedi arılar.
"Ne güzel kokuyorsunuz!" dedi kelebekler.

Çiçekler, baharın gelişini kutluyordu. Her biri kendi rengini, kokusunu ve güzelliğini sergiliyordu. Lale kırmızı, papatya beyaz, gül ise pembe açmıştı.

"Biz, baharın habercileriyiz!" dedi lale.
"Ve doğanın güzelliğiyiz!" dedi papatya.
"Birlikte, dünyayı güzelleştiriyoruz!" dedi gül.

Bahar, tüm güzelliğiyle gelmişti. Çiçekler açmış, doğa yeniden canlanmıştı. Her şey, yeni bir başlangıcın mutluluğunu yaşıyordu.`,
            },
          ],
          enhancementStyles: [
            {
              id: 1,
              name: "Suluboya",
              description: "Yumuşak ve akıcı renkler",
              icon: "water",
              preview: selectedDrawing.imageData, // Gerçek uygulamada AI tarafından oluşturulacak
            },
            {
              id: 2,
              name: "Pastel",
              description: "Yumuşak ve pastel tonlar",
              icon: "palette",
              preview: selectedDrawing.imageData,
            },
            {
              id: 3,
              name: "Çizgi Roman",
              description: "Bold ve canlı renkler",
              icon: "comic-bubble",
              preview: selectedDrawing.imageData,
            },
            {
              id: 4,
              name: "Piksel Art",
              description: "Retro piksel tarzı",
              icon: "grid",
              preview: selectedDrawing.imageData,
            },
          ],
        };
        setAIAnalysis(analysis);
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("AI analizi sırasında hata:", error);
      Alert.alert("Hata", "AI analizi sırasında bir hata oluştu");
      setIsAnalyzing(false);
      setIsAIAnalysisModalVisible(false);
    }
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    // Gerçek uygulamada burada AI ile çizimi güzelleştirme işlemi yapılacak
    setEnhancedDrawing(style.preview);
  };

  const handleApplyStyle = () => {
    if (selectedStyle && enhancedDrawing) {
      setDrawing({
        ...drawing,
        imageData: enhancedDrawing,
      });
      setIsAIAnalysisModalVisible(false);
      Alert.alert("Başarılı", "Çiziminiz yeni stille güncellendi!");
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hikaye Oluştur</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAIAnalysis}
          >
            <MaterialCommunityIcons name="robot" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

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
          style={{ maxHeight: 200 }}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {selectedDrawing && (
          <View style={styles.selectedDrawingContainer}>
            <View style={styles.selectedDrawingPreview}>
              <Text style={styles.previewText}>{selectedDrawing.name}</Text>
              <View style={styles.previewImageContainer}>
                <Image
                  source={{
                    uri: selectedDrawing.imageData.startsWith("data:image")
                      ? selectedDrawing.imageData
                      : `data:image/png;base64,${selectedDrawing.imageData}`,
                  }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <View style={styles.previewButtons}>
                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => {
                      // Değiştir butonu için işlem
                      setSelectedDrawing(null);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="swap-horizontal"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => {
                      // Sil butonu için işlem
                      setSelectedDrawing(null);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Başlık</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Hikayenin başlığını girin"
                  placeholderTextColor="#999"
                  fontSize={13}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kategori</Text>
                <TouchableOpacity
                  style={styles.categoryButton}
                  onPress={() => setIsCategoryModalVisible(true)}
                >
                  <View style={styles.selectedCategoryContainer}>
                    {category && (
                      <MaterialCommunityIcons
                        name={
                          categories.find((cat) => cat.name === category)?.icon
                        }
                        size={24}
                        color="#424242"
                        style={styles.selectedCategoryIcon}
                      />
                    )}
                    <Text style={styles.categoryButtonText}>
                      {category || "Kategori Seç"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hikaye İçeriği</Text>
          {renderTextTools()}
          <TextInput
            style={[
              styles.input,
              styles.contentInput,
              textStyle.bold && { fontWeight: "bold" },
              textStyle.italic && { fontStyle: "italic" },
              {
                color: textStyle.color,
                fontSize: textStyle.fontSize,
                textAlign: textStyle.align,
              },
            ]}
            value={content}
            onChangeText={setContent}
            placeholder="Hikayenizi yazın..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleSaveStory}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Hikaye Oluştur</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kategori Seç</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              <View style={styles.categoryGrid}>
                {filteredCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      category === cat.name && styles.selectedCategory,
                    ]}
                    onPress={() => handleCategorySelect(cat)}
                  >
                    <View style={styles.categoryIconContainer}>
                      <MaterialCommunityIcons
                        name={cat.icon}
                        size={40}
                        color={cat.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryItemText,
                        category === cat.name && styles.selectedCategoryText,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAIAnalysisModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAIAnalysisModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isAnalyzing
                  ? "AI Analizi Yapılıyor..."
                  : "AI Analiz Sonuçları"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsAIAnalysisModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {isAnalyzing ? (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons
                  name="robot"
                  size={50}
                  color="#4CAF50"
                />
                <Text style={styles.loadingText}>
                  Çiziminiz analiz ediliyor...
                </Text>
              </View>
            ) : aiAnalysis ? (
              <ScrollView style={styles.analysisContent}>
                <Text style={styles.analysisTitle}>{aiAnalysis.title}</Text>
                <Text style={styles.analysisDescription}>
                  {aiAnalysis.description}
                </Text>

                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Tespit Edilen Öğeler:</Text>
                  {aiAnalysis.elements.map((element, index) => (
                    <View key={index} style={styles.elementItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.elementText}>{element}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Hikaye Analizi:</Text>
                  <View style={styles.analysisCard}>
                    <View style={styles.analysisRow}>
                      <MaterialCommunityIcons
                        name="emoticon-happy"
                        size={24}
                        color="#4CAF50"
                      />
                      <Text style={styles.analysisLabel}>Duygu:</Text>
                      <Text style={styles.analysisValue}>
                        {aiAnalysis.storyAnalysis.mood}
                      </Text>
                    </View>
                    <View style={styles.analysisRow}>
                      <MaterialCommunityIcons
                        name="theme-light-dark"
                        size={24}
                        color="#4CAF50"
                      />
                      <Text style={styles.analysisLabel}>Tema:</Text>
                      <Text style={styles.analysisValue}>
                        {aiAnalysis.storyAnalysis.theme}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.subsectionTitle}>
                    Potansiyel Karakterler:
                  </Text>
                  <View style={styles.tagContainer}>
                    {aiAnalysis.storyAnalysis.potentialCharacters.map(
                      (character, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{character}</Text>
                        </View>
                      )
                    )}
                  </View>

                  <Text style={styles.subsectionTitle}>Önerilen Mekanlar:</Text>
                  <View style={styles.tagContainer}>
                    {aiAnalysis.storyAnalysis.suggestedSettings.map(
                      (setting, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{setting}</Text>
                        </View>
                      )
                    )}
                  </View>
                </View>

                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Hikaye Önerileri:</Text>
                  {aiAnalysis.storySuggestions.map((story) => (
                    <TouchableOpacity
                      key={story.id}
                      style={styles.storyCard}
                      onPress={() => handleStorySelect(story)}
                    >
                      <View style={styles.storyHeader}>
                        <Text style={styles.storyTitle}>{story.title}</Text>
                        <View style={styles.storyType}>
                          <Text style={styles.storyTypeText}>{story.type}</Text>
                        </View>
                      </View>
                      <Text style={styles.storyDescription}>
                        {story.description}
                      </Text>
                      <View style={styles.outlineContainer}>
                        {story.outline.map((point, index) => (
                          <View key={index} style={styles.outlineItem}>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={20}
                              color="#4CAF50"
                            />
                            <Text style={styles.outlineText}>{point}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.keywordContainer}>
                        {story.keywords.map((keyword, index) => (
                          <View key={index} style={styles.keyword}>
                            <Text style={styles.keywordText}>#{keyword}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.analysisSection}>
                  <Text style={styles.sectionTitle}>Çizim Güzelleştirme:</Text>
                  <View style={styles.styleGrid}>
                    {aiAnalysis.enhancementStyles.map((style) => (
                      <TouchableOpacity
                        key={style.id}
                        style={[
                          styles.styleItem,
                          selectedStyle?.id === style.id &&
                            styles.selectedStyle,
                        ]}
                        onPress={() => handleStyleSelect(style)}
                      >
                        <View style={styles.stylePreview}>
                          <Image
                            source={{ uri: style.preview }}
                            style={styles.stylePreviewImage}
                          />
                          <View style={styles.styleOverlay}>
                            <MaterialCommunityIcons
                              name={style.icon}
                              size={24}
                              color="#fff"
                            />
                          </View>
                        </View>
                        <Text style={styles.styleName}>{style.name}</Text>
                        <Text style={styles.styleDescription}>
                          {style.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {selectedStyle && (
                    <TouchableOpacity
                      style={styles.applyStyleButton}
                      onPress={handleApplyStyle}
                    >
                      <Text style={styles.applyStyleButtonText}>
                        {selectedStyle.name} Stilini Uygula
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {renderVoiceControls()}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
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
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 300,
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
    flex: 1,
    justifyContent: "space-between",
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
  },
  analysisContent: {
    padding: 15,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 10,
  },
  analysisDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  analysisSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 10,
  },
  elementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
  },
  elementText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#424242",
  },
  analysisCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  analysisRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  analysisLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
    marginLeft: 10,
    marginRight: 5,
  },
  analysisValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
    marginTop: 15,
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  tag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  storyCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242",
    flex: 1,
  },
  storyType: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  storyTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  storyDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  outlineContainer: {
    marginBottom: 15,
  },
  outlineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  outlineText: {
    fontSize: 14,
    color: "#424242",
    marginLeft: 5,
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keyword: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  styleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  styleItem: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedStyle: {
    borderColor: "#4CAF50",
  },
  stylePreview: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  stylePreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  styleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  styleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
    padding: 10,
    paddingBottom: 5,
  },
  styleDescription: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  applyStyleButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  applyStyleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
