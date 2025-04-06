import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PrivacyScreen() {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    personalizedAds: false,
    locationServices: false,
    analytics: true,
  });

  const toggleSwitch = (key) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const privacyItems = [
    {
      id: 1,
      title: "Veri Toplama",
      description: "Uygulama geliştirme için anonim veri toplama",
      icon: "database",
      key: "dataCollection",
    },
    {
      id: 2,
      title: "Kişiselleştirilmiş Reklamlar",
      description: "İlgi alanlarınıza göre reklam gösterimi",
      icon: "advertisements",
      key: "personalizedAds",
    },
    {
      id: 3,
      title: "Konum Hizmetleri",
      description: "Konum bazlı özellikleri kullan",
      icon: "map-marker",
      key: "locationServices",
    },
    {
      id: 4,
      title: "Analitik",
      description: "Kullanım istatistiklerini topla",
      icon: "chart-bar",
      key: "analytics",
    },
  ];

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gizlilik</Text>
      </View>

      <ScrollView style={styles.content}>
        {privacyItems.map((item) => (
          <View key={item.id} style={styles.privacyItem}>
            <View style={styles.privacyHeader}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>{item.title}</Text>
                <Text style={styles.privacyDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Switch
              value={privacySettings[item.key]}
              onValueChange={() => toggleSwitch(item.key)}
              trackColor={{ false: "#767577", true: "#81c784" }}
              thumbColor={privacySettings[item.key] ? "#4caf50" : "#f4f3f4"}
            />
          </View>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Gizlilik Politikası</Text>
          <Text style={styles.infoText}>
            Hayal Dünyam, kullanıcı gizliliğine önem verir. Toplanan veriler
            sadece uygulamanın geliştirilmesi ve iyileştirilmesi için
            kullanılır.
          </Text>
        </View>

        <TouchableOpacity style={styles.policyButton}>
          <Text style={styles.policyText}>Gizlilik Politikasını Görüntüle</Text>
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
  privacyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 15,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 12,
    color: "#E8F5E9",
  },
  infoSection: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#E8F5E9",
    lineHeight: 20,
  },
  policyButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  policyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
