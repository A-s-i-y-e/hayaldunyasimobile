import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AboutScreen() {
  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hakkında</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="tree" size={80} color="#fff" />
        </View>

        <View style={styles.section}>
          <Text style={styles.appName}>Hayal Dünyam</Text>
          <Text style={styles.version}>Versiyon 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            Hayal Dünyam, okul öncesi dönem çocuklarının (3-7 yaş)
            yaratıcılıklarını ve hayal güçlerini geliştirmeyi amaçlayan, yapay
            zeka destekli interaktif bir hikaye oluşturma platformudur.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proje Bilgileri</Text>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="school" size={24} color="#fff" />
            <Text style={styles.infoText}>Fırat Üniversitesi</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="book-open-variant"
              size={24}
              color="#fff"
            />
            <Text style={styles.infoText}>Yazılım Mühendisliği Bölümü</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account" size={24} color="#fff" />
            <Text style={styles.infoText}>Asiye KAYMAK - 215541097</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proje Yürütücüleri</Text>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="teach" size={24} color="#fff" />
            <Text style={styles.infoText}>Öğr.Gör. Eyüp ERÖZ</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="teach" size={24} color="#fff" />
            <Text style={styles.infoText}>
              Dr. Öğr. Üyesi Vahdettin Cem BAYDOĞAN
            </Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: "#E8F5E9",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#E8F5E9",
    lineHeight: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
});
