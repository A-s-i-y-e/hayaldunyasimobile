import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function CreationScreen({ navigation }) {
  // Hikaye state'leri
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [category, setCategory] = useState("");
  const [moral, setMoral] = useState("");

  // Çizim state'leri
  const [drawingTitle, setDrawingTitle] = useState("");
  const [drawingType, setDrawingType] = useState("");
  const [colors, setColors] = useState("");
  const [drawingDescription, setDrawingDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSaveStory = async () => {
    if (!storyTitle || !storyContent || !ageGroup || !category || !moral) {
      Alert.alert("Hata", "Lütfen tüm hikaye alanlarını doldurun.");
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const newStory = {
        title: storyTitle,
        content: storyContent,
        ageGroup,
        category,
        moral,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
      };

      await updateDoc(userRef, {
        stories: arrayUnion(newStory),
      });

      Alert.alert("Başarılı", "Hikaye başarıyla kaydedildi!");
      // Form temizleme
      setStoryTitle("");
      setStoryContent("");
      setAgeGroup("");
      setCategory("");
      setMoral("");
    } catch (error) {
      console.error("Hikaye kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Hikaye kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDrawing = async () => {
    if (!drawingTitle || !drawingType || !colors) {
      Alert.alert("Hata", "Lütfen tüm çizim alanlarını doldurun.");
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const newDrawing = {
        title: drawingTitle,
        type: drawingType,
        colors: colors.split(",").map((color) => color.trim()),
        description: drawingDescription,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
      };

      await updateDoc(userRef, {
        drawings: arrayUnion(newDrawing),
      });

      Alert.alert("Başarılı", "Çizim başarıyla kaydedildi!");
      // Form temizleme
      setDrawingTitle("");
      setDrawingType("");
      setColors("");
      setDrawingDescription("");
    } catch (error) {
      console.error("Çizim kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Çizim kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>Yeni Oluştur</Text>
      </View>

      {/* Hikaye Oluşturma Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hikaye Oluştur</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hikaye Başlığı</Text>
            <TextInput
              style={styles.input}
              value={storyTitle}
              onChangeText={setStoryTitle}
              placeholder="Hikayenize bir başlık verin"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hikaye İçeriği</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={storyContent}
              onChangeText={setStoryContent}
              placeholder="Hikayenizi yazın..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yaş Grubu</Text>
            <TextInput
              style={styles.input}
              value={ageGroup}
              onChangeText={setAgeGroup}
              placeholder="Örn: 5-7 yaş"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Örn: Macera, Fantastik, Eğitici"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hikayenin Ana Mesajı</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={moral}
              onChangeText={setMoral}
              placeholder="Hikayenin vermek istediği mesajı yazın..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

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
      </View>

      {/* Çizim Oluşturma Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Çizim Oluştur</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Çizim Başlığı</Text>
            <TextInput
              style={styles.input}
              value={drawingTitle}
              onChangeText={setDrawingTitle}
              placeholder="Çiziminize bir başlık verin"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Çizim Türü</Text>
            <TextInput
              style={styles.input}
              value={drawingType}
              onChangeText={setDrawingType}
              placeholder="Örn: Serbest Çizim, Boyama, Kolaj"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kullanılan Renkler</Text>
            <TextInput
              style={styles.input}
              value={colors}
              onChangeText={setColors}
              placeholder="Örn: Kırmızı, Mavi, Yeşil (virgülle ayırın)"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Çizim Açıklaması</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={drawingDescription}
              onChangeText={setDrawingDescription}
              placeholder="Çiziminiz hakkında kısa bir açıklama yazın..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveDrawing}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Kaydediliyor..." : "Çizimi Kaydet"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F5F5F5",
  },
  contentInput: {
    height: 120,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
