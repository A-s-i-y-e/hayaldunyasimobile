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

export default function StoryCreationScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [category, setCategory] = useState("");
  const [moral, setMoral] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !content || !ageGroup || !category || !moral) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const newStory = {
        title,
        content,
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
      navigation.goBack();
    } catch (error) {
      console.error("Hikaye kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Hikaye kaydedilirken bir hata oluştu.");
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
        <Text style={styles.title}>Yeni Hikaye Oluştur</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hikaye Başlığı</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Hikayenize bir başlık verin"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hikaye İçeriği</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={content}
            onChangeText={setContent}
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
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Kaydediliyor..." : "Hikayeyi Kaydet"}
          </Text>
        </TouchableOpacity>
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
  form: {
    padding: 20,
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
