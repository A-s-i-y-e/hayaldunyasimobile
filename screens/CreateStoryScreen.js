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
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function CreateStoryScreen({ route }) {
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
    if (route.params?.drawingData) {
      setDrawing({
        imageData: route.params.drawingData,
        name: route.params.drawingName,
      });
    }
    fetchDrawings();
  }, [route.params]);

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
            // Çizimi hikaye oluşturmada kullan
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

  const handleCreateStory = () => {
    if (!title || !content || !category) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    // Hikaye oluşturma işlemi burada yapılacak
    Alert.alert("Başarılı", "Hikaye başarıyla oluşturuldu");
    setTitle("");
    setContent("");
    setCategory("");
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

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hikaye Oluştur</Text>
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
          data={drawings.filter((drawing) =>
            drawing.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderDrawingItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <ScrollView style={styles.content}>
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

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateStory}
        >
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
                {categories.map((cat) => (
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
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});
