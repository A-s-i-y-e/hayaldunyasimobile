import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export default function EditStoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { story } = route.params;
  const db = getFirestore();

  const [title, setTitle] = useState(story.title);
  const [description, setDescription] = useState(story.description);
  const [content, setContent] = useState(story.content);
  const [category, setCategory] = useState(story.category);
  const [backgroundColor, setBackgroundColor] = useState(story.backgroundColor);
  const [textColor, setTextColor] = useState(story.textColor);

  const handleSave = async () => {
    try {
      const storyRef = doc(db, "stories", story.id);
      const updateData = {
        title: title || story.title,
        description: description || story.description,
        content: content || story.content,
        category: category || story.category,
        backgroundColor: backgroundColor || story.backgroundColor,
        textColor: textColor || story.textColor,
        updatedAt: new Date(),
      };

      // undefined değerleri temizle
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateDoc(storyRef, updateData);
      Alert.alert("Başarılı", "Hikaye başarıyla güncellendi");
      navigation.goBack();
    } catch (error) {
      console.error("Hikaye güncellenirken hata:", error);
      Alert.alert("Hata", "Hikaye güncellenirken bir hata oluştu");
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Hikayeyi Düzenle</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Başlık</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Hikaye başlığı"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Hikaye açıklaması"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İçerik</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Hikaye içeriği"
            multiline
            numberOfLines={10}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Hikaye kategorisi"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Arka Plan Rengi</Text>
          <TextInput
            style={styles.input}
            value={backgroundColor}
            onChangeText={setBackgroundColor}
            placeholder="#FFFFFF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Metin Rengi</Text>
          <TextInput
            style={styles.input}
            value={textColor}
            onChangeText={setTextColor}
            placeholder="#000000"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
