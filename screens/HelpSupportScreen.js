import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HelpSupportScreen() {
  const faqItems = [
    {
      id: 1,
      question: "Nasıl hikaye oluşturabilirim?",
      answer:
        "Ana sayfadan 'Hikayeler' bölümüne giderek yeni bir hikaye oluşturabilirsiniz. Çizim yapabilir, ses kaydı ekleyebilir ve hikayenizi kaydedebilirsiniz.",
    },
    {
      id: 2,
      question: "Çizimlerim nasıl analiz ediliyor?",
      answer:
        "Yapay zeka teknolojimiz çizimlerinizi analiz ederek karakterleri ve nesneleri tanımlar. Bu sayede hikayeniz için özel öneriler sunar.",
    },
    {
      id: 3,
      question: "Ebeveyn kontrolü nasıl çalışır?",
      answer:
        "Ebeveynler profil ayarlarından çocuklarının aktivitelerini takip edebilir, içerik filtreleri ayarlayabilir ve kullanım süresini yönetebilir.",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yardım & Destek</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="email" size={24} color="#fff" />
            <Text style={styles.contactText}>destek@hayaldunyasi.com</Text>
          </View>
          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="phone" size={24} color="#fff" />
            <Text style={styles.contactText}>+90 555 123 4567</Text>
          </View>
        </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  faqItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  answer: {
    fontSize: 14,
    color: "#E8F5E9",
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
});
