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
  const db = getFirestore();
  const auth = getAuth();

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

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hikaye Oluştur</Text>
      </View>

      <View style={styles.drawingsContainer}>
        <Text style={styles.drawingsTitle}>Çizimlerim</Text>
        <FlatList
          data={drawings}
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
                <TextInput
                  style={styles.input}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Hikayenin kategorisini girin"
                  placeholderTextColor="#999"
                  fontSize={13}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hikaye İçeriği</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Hikayenin içeriğini girin"
            placeholderTextColor="#999"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            fontSize={13}
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
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    height: 45,
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
  drawingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    paddingHorizontal: 8,
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
});
