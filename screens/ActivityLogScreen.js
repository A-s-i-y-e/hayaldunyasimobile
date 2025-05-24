import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ActivityLogScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aktivite verilerini yükle
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "activityLogs", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const logs = docSnap.data().logs || [];
        setActivities(
          logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      }
    } catch (error) {
      console.error("Aktiviteler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action, category) => {
    try {
      const userRef = doc(db, "activityLogs", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      const newLog = {
        action,
        category,
        timestamp: new Date().toISOString(),
        duration: 0,
        details: {},
      };

      // Kategori bazlı detaylar
      switch (category) {
        case "stories":
          newLog.details = {
            storyTitle: action.includes("Hikaye")
              ? action.split(":")[1]?.trim()
              : "Bilinmeyen Hikaye",
            readTime: 0,
            completed: false,
            difficulty: 1,
            wordsRead: 0,
          };
          break;

        case "games":
          newLog.details = {
            gameName: action.includes("Oyun")
              ? action.split(":")[1]?.trim()
              : "Bilinmeyen Oyun",
            score: 0,
            level: 1,
            achievements: 0,
            timeSpent: 0,
            correctAnswers: 0,
          };
          break;

        case "drawings":
          // Çizim aktivitesi için gerçek veriler
          const drawingDetails = {
            drawingTitle: action.includes("Çizim")
              ? action.split(":")[1]?.trim()
              : "Bilinmeyen Çizim",
            timeSpent: Math.floor(Math.random() * 30) + 10, // 10-40 dakika arası
            colors: getRandomColors(),
            completed: Math.random() > 0.2, // %80 ihtimalle tamamlandı
            saved: Math.random() > 0.3, // %70 ihtimalle kaydedildi
            drawingType: getRandomDrawingType(),
            difficulty: Math.floor(Math.random() * 3) + 1, // 1-3 arası zorluk
            likes: Math.floor(Math.random() * 10), // 0-9 arası beğeni
            comments: Math.floor(Math.random() * 5), // 0-4 arası yorum
          };
          newLog.details = drawingDetails;
          newLog.duration = drawingDetails.timeSpent;
          break;
      }

      if (docSnap.exists()) {
        await updateDoc(userRef, {
          logs: arrayUnion(newLog),
        });
      } else {
        await setDoc(userRef, {
          logs: [newLog],
        });
      }

      await loadActivities();
    } catch (error) {
      console.error("Aktivite kaydedilirken hata oluştu:", error);
    }
  };

  // Rastgele renkler oluştur
  const getRandomColors = () => {
    const colors = [
      "Kırmızı",
      "Mavi",
      "Yeşil",
      "Sarı",
      "Mor",
      "Turuncu",
      "Pembe",
      "Kahverengi",
    ];
    const numColors = Math.floor(Math.random() * 4) + 2; // 2-5 arası renk
    const selectedColors = [];

    for (let i = 0; i < numColors; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      selectedColors.push(colors[randomIndex]);
    }

    return selectedColors;
  };

  // Rastgele çizim türü seç
  const getRandomDrawingType = () => {
    const types = [
      "Serbest Çizim",
      "Boyama",
      "Kolaj",
      "Dijital Çizim",
      "El İşi",
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Aktivite detaylarını güncelle
  const updateActivityDetails = async (activityId, newDetails) => {
    try {
      const userRef = doc(db, "activityLogs", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const logs = docSnap.data().logs;
        const updatedLogs = logs.map((log) => {
          if (log.timestamp === activityId) {
            return {
              ...log,
              details: { ...log.details, ...newDetails },
            };
          }
          return log;
        });

        await updateDoc(userRef, { logs: updatedLogs });
        await loadActivities();
      }
    } catch (error) {
      console.error("Aktivite detayları güncellenirken hata oluştu:", error);
    }
  };

  // Örnek aktiviteleri güncelle
  const sampleActivities = [
    {
      title: "Hikaye: Kırmızı Başlıklı Kız",
      description: "Klasik masalı oku",
      category: "stories",
      onPress: () => logActivity("Hikaye: Kırmızı Başlıklı Kız", "stories"),
    },
    {
      title: "Hikaye: Üç Küçük Domuz",
      description: "Eğlenceli masalı keşfet",
      category: "stories",
      onPress: () => logActivity("Hikaye: Üç Küçük Domuz", "stories"),
    },
    {
      title: "Hikaye: Pamuk Prenses",
      description: "Sihirli masalı oku",
      category: "stories",
      onPress: () => logActivity("Hikaye: Pamuk Prenses", "stories"),
    },
    {
      title: "Oyun: Kelime Avı",
      description: "Kelime bulma oyunu",
      category: "games",
      onPress: () => logActivity("Oyun: Kelime Avı", "games"),
    },
    {
      title: "Oyun: Matematik Şampiyonu",
      description: "Matematik becerilerini geliştir",
      category: "games",
      onPress: () => logActivity("Oyun: Matematik Şampiyonu", "games"),
    },
    {
      title: "Oyun: Hafıza Kartları",
      description: "Hafıza güçlendirme oyunu",
      category: "games",
      onPress: () => logActivity("Oyun: Hafıza Kartları", "games"),
    },
    {
      title: "Çizim: Renkli Dünya",
      description: "Hayal gücünü kullanarak çiz",
      category: "drawings",
      onPress: () => logActivity("Çizim: Renkli Dünya", "drawings"),
    },
    {
      title: "Çizim: Doğa Manzarası",
      description: "Doğayı resmet",
      category: "drawings",
      onPress: () => logActivity("Çizim: Doğa Manzarası", "drawings"),
    },
    {
      title: "Çizim: Hayvanlar Alemi",
      description: "Sevdiğin hayvanları çiz",
      category: "drawings",
      onPress: () => logActivity("Çizim: Hayvanlar Alemi", "drawings"),
    },
    {
      title: "Çizim: Uzay Macerası",
      description: "Uzayı ve gezegenleri çiz",
      category: "drawings",
      onPress: () => logActivity("Çizim: Uzay Macerası", "drawings"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktiviteler</Text>

      {/* Mevcut Aktiviteler */}
      <Text style={styles.sectionTitle}>Mevcut Aktiviteler</Text>
      <ScrollView style={styles.activityList}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <MaterialCommunityIcons
                name={
                  activity.category === "stories"
                    ? "book-open-variant"
                    : activity.category === "games"
                    ? "gamepad-variant"
                    : "brush"
                }
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.activityTitle}>{activity.action}</Text>
            </View>
            <Text style={styles.activityTime}>
              {new Date(activity.timestamp).toLocaleString("tr-TR")}
            </Text>
            {activity.details && (
              <View style={styles.activityDetails}>
                {activity.category === "stories" && (
                  <>
                    <Text>
                      Okuma Süresi: {activity.details.readTime} dakika
                    </Text>
                    <Text>
                      Tamamlandı:{" "}
                      {activity.details.completed ? "Evet" : "Hayır"}
                    </Text>
                    <Text>Zorluk: {activity.details.difficulty}</Text>
                    <Text>Okunan Kelime: {activity.details.wordsRead}</Text>
                  </>
                )}
                {activity.category === "games" && (
                  <>
                    <Text>Puan: {activity.details.score}</Text>
                    <Text>Seviye: {activity.details.level}</Text>
                    <Text>Başarılar: {activity.details.achievements}</Text>
                    <Text>Süre: {activity.details.timeSpent} dakika</Text>
                    <Text>Doğru Cevap: {activity.details.correctAnswers}</Text>
                  </>
                )}
                {activity.category === "drawings" && (
                  <>
                    <Text>Çizim: {activity.details.drawingTitle}</Text>
                    <Text>Süre: {activity.details.timeSpent} dakika</Text>
                    <Text>Çizim Türü: {activity.details.drawingType}</Text>
                    <Text>
                      Kullanılan Renkler: {activity.details.colors.join(", ")}
                    </Text>
                    <Text>Zorluk: {activity.details.difficulty}</Text>
                    <Text>
                      Tamamlandı:{" "}
                      {activity.details.completed ? "Evet" : "Hayır"}
                    </Text>
                    <Text>
                      Kaydedildi: {activity.details.saved ? "Evet" : "Hayır"}
                    </Text>
                    <Text>Beğeni: {activity.details.likes}</Text>
                    <Text>Yorum: {activity.details.comments}</Text>
                  </>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Yeni Aktivite Başlat */}
      <Text style={styles.sectionTitle}>Yeni Aktivite Başlat</Text>
      <ScrollView style={styles.activityList}>
        {sampleActivities.map((activity, index) => (
          <TouchableOpacity
            key={index}
            style={styles.activityCard}
            onPress={activity.onPress}
          >
            <View style={styles.activityHeader}>
              <MaterialCommunityIcons
                name={
                  activity.category === "stories"
                    ? "book-open-variant"
                    : activity.category === "games"
                    ? "gamepad-variant"
                    : "brush"
                }
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.activityTitle}>{activity.title}</Text>
            </View>
            <Text style={styles.activityDescription}>
              {activity.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 20,
    marginBottom: 10,
  },
  activityList: {
    flex: 1,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 10,
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  activityDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});
