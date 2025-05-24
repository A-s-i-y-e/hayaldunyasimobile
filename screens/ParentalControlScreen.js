import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function ParentalControlScreen({ navigation }) {
  const [controls, setControls] = useState({
    timeLimit: false,
    activityMonitor: false,
  });
  const [timeLimitModal, setTimeLimitModal] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("60");
  const [activityModal, setActivityModal] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(true);
  const [password, setPassword] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [activityCategories, setActivityCategories] = useState({
    stories: 0,
    games: 0,
    drawings: 0,
    total: 0,
  });

  const loadParentalControls = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "parentalControls", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setControls({
          timeLimit: data.timeLimit || false,
          activityMonitor: data.activityMonitor || false,
        });
        setDailyLimit(data.timeLimitMinutes?.toString() || "60");
      }
    } catch (error) {
      console.error("Ebeveyn kontrolü ayarları yüklenirken hata:", error);
      Alert.alert("Hata", "Ayarlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCheck = async () => {
    try {
      if (!auth.currentUser?.email) {
        Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı");
        return;
      }

      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        auth.currentUser.email,
        password
      );

      if (userCredential.user) {
        setPasswordModal(false);
        await loadParentalControls();
      }
    } catch (error) {
      console.error("Şifre kontrolü sırasında hata:", error);
      Alert.alert("Hata", "Şifre yanlış. Lütfen tekrar deneyin.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = async (key) => {
    try {
      const newControls = { ...controls, [key]: !controls[key] };
      setControls(newControls);

      const userRef = doc(db, "parentalControls", auth.currentUser.uid);
      await setDoc(userRef, newControls, { merge: true });

      if (key === "timeLimit") {
        if (newControls[key]) {
          await setDoc(
            userRef,
            {
              lastActiveTime: new Date().toISOString(),
            },
            { merge: true }
          );
          Alert.alert("Başarılı", "Zaman sınırı aktifleştirildi");
        } else {
          Alert.alert("Başarılı", "Zaman sınırı devre dışı bırakıldı");
        }
      } else {
        Alert.alert(
          "Başarılı",
          `${key === "timeLimit" ? "Zaman sınırı" : "Aktivite takibi"} ${
            newControls[key] ? "aktifleştirildi" : "devre dışı bırakıldı"
          }`
        );
      }
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Ayarlar kaydedilirken bir hata oluştu");
      setControls(controls);
    }
  };

  const handleTimeLimitSave = async () => {
    try {
      const minutes = parseInt(dailyLimit);
      if (isNaN(minutes) || minutes < 0) {
        Alert.alert("Hata", "Lütfen geçerli bir süre girin");
        return;
      }

      const userRef = doc(db, "parentalControls", auth.currentUser.uid);
      await setDoc(
        userRef,
        {
          timeLimitMinutes: minutes,
          timeLimit: true,
          lastActiveTime: new Date().toISOString(),
        },
        { merge: true }
      );

      setTimeLimitModal(false);
      setControls((prev) => ({ ...prev, timeLimit: true }));
      Alert.alert("Başarılı", "Günlük kullanım süresi güncellendi", [
        {
          text: "Tamam",
          onPress: () => {
            // Ana sayfaya yönlendir
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Süre limiti kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Süre limiti kaydedilirken bir hata oluştu");
    }
  };

  const loadActivityData = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "activityLogs", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const logs = docSnap.data().logs || [];
        const now = new Date();

        // Filtreleme
        let filteredLogs = logs;
        switch (activityFilter) {
          case "today":
            filteredLogs = logs.filter((log) => {
              const logDate = new Date(log.timestamp);
              return logDate.toDateString() === now.toDateString();
            });
            break;
          case "week":
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredLogs = logs.filter(
              (log) => new Date(log.timestamp) >= weekAgo
            );
            break;
          case "month":
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filteredLogs = logs.filter(
              (log) => new Date(log.timestamp) >= monthAgo
            );
            break;
        }

        // Kategorilere göre sayım
        const categories = {
          stories: 0,
          games: 0,
          drawings: 0,
          total: filteredLogs.length,
        };

        filteredLogs.forEach((log) => {
          if (log.category) {
            categories[log.category] = (categories[log.category] || 0) + 1;
          }
        });

        setActivityCategories(categories);
        setActivityData(
          filteredLogs.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      }
      setActivityModal(true);
    } catch (error) {
      console.error("Aktivite verileri yüklenirken hata oluştu:", error);
      Alert.alert("Hata", "Aktivite verileri yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const renderActivityChart = () => {
    const chartData = {
      labels: ["Hikayeler", "Oyunlar", "Çizimler"],
      datasets: [
        {
          data: [
            activityCategories.stories,
            activityCategories.games,
            activityCategories.drawings,
          ],
        },
      ],
    };

    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 40;

    return (
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.5,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>
    );
  };

  const controlItems = [
    {
      id: 1,
      title: "Zaman Sınırı",
      description: "Günlük kullanım süresini sınırla",
      icon: "clock",
      key: "timeLimit",
      action: () => setTimeLimitModal(true),
    },
    {
      id: 2,
      title: "Aktivite Takibi",
      description: "Çocuğunuzun aktivitelerini takip edin",
      icon: "chart-line",
      key: "activityMonitor",
      action: loadActivityData,
    },
  ];

  if (passwordModal) {
    return (
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ebeveyn Kontrolü</Text>
        </View>
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordTitle}>Hesap Şifresi</Text>
          <Text style={styles.passwordDescription}>
            Bu bölüme erişmek için hesap şifrenizi girmeniz gerekmektedir.
          </Text>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            placeholderTextColor="#666"
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.passwordButton, loading && styles.buttonDisabled]}
            onPress={handlePasswordCheck}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.backButton,
              { marginTop: 10, backgroundColor: "#F44336" },
            ]}
            onPress={() => {
              Alert.alert(
                "Çıkış Yap",
                "Uygulamadan çıkış yapmak istediğinize emin misiniz?",
                [
                  {
                    text: "İptal",
                    style: "cancel",
                  },
                  {
                    text: "Çıkış Yap",
                    onPress: () => BackHandler.exitApp(),
                    style: "destructive",
                  },
                ]
              );
            }}
          >
            <Text style={styles.backButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ebeveyn Kontrolü</Text>
      </View>

      <ScrollView style={styles.content}>
        {controlItems.map((item) => (
          <View key={item.id} style={styles.controlItem}>
            <View style={styles.controlHeader}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <View style={styles.controlText}>
                <Text style={styles.controlTitle}>{item.title}</Text>
                <Text style={styles.controlDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View style={styles.controlActions}>
              {item.action && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={item.action}
                >
                  <MaterialCommunityIcons name="cog" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              <Switch
                value={controls[item.key]}
                onValueChange={() => toggleSwitch(item.key)}
                trackColor={{ false: "#767577", true: "#81c784" }}
                thumbColor={controls[item.key] ? "#4caf50" : "#f4f3f4"}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={timeLimitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setTimeLimitModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Günlük Kullanım Süresi</Text>
            <TextInput
              style={styles.input}
              value={dailyLimit}
              onChangeText={setDailyLimit}
              keyboardType="numeric"
              placeholder="Dakika cinsinden süre"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setTimeLimitModal(false)}
              >
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleTimeLimitSave}
              >
                <Text style={styles.buttonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActivityModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aktivite Geçmişi</Text>

            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === "all" && styles.filterButtonActive,
                ]}
                onPress={() => setActivityFilter("all")}
              >
                <Text style={styles.filterButtonText}>Tümü</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === "today" && styles.filterButtonActive,
                ]}
                onPress={() => setActivityFilter("today")}
              >
                <Text style={styles.filterButtonText}>Bugün</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === "week" && styles.filterButtonActive,
                ]}
                onPress={() => setActivityFilter("week")}
              >
                <Text style={styles.filterButtonText}>Hafta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activityFilter === "month" && styles.filterButtonActive,
                ]}
                onPress={() => setActivityFilter("month")}
              >
                <Text style={styles.filterButtonText}>Ay</Text>
              </TouchableOpacity>
            </View>

            {renderActivityChart()}

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Toplam Aktivite</Text>
                <Text style={styles.statValue}>{activityCategories.total}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Hikayeler</Text>
                <Text style={styles.statValue}>
                  {activityCategories.stories}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Oyunlar</Text>
                <Text style={styles.statValue}>{activityCategories.games}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Çizimler</Text>
                <Text style={styles.statValue}>
                  {activityCategories.drawings}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.activityList}>
              {activityData.length > 0 ? (
                activityData.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <MaterialCommunityIcons
                      name={
                        activity.category === "stories"
                          ? "book-open-variant"
                          : activity.category === "games"
                          ? "gamepad-variant"
                          : "draw"
                      }
                      size={24}
                      color="#4CAF50"
                      style={styles.activityIcon}
                    />
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityText}>{activity.action}</Text>
                      <Text style={styles.activityTime}>
                        {new Date(activity.timestamp).toLocaleString("tr-TR")}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noActivityText}>
                  Seçilen dönemde aktivite kaydı bulunmuyor
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setActivityModal(false)}
            >
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
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
  controlItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 15,
  },
  controlText: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  controlDescription: {
    fontSize: 12,
    color: "#E8F5E9",
  },
  controlActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  closeButton: {
    backgroundColor: "#607D8B",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activityList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activityIcon: {
    marginRight: 10,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    color: "#333",
  },
  activityTime: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  passwordContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  passwordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  passwordDescription: {
    fontSize: 16,
    color: "#E8F5E9",
    marginBottom: 30,
    textAlign: "center",
  },
  passwordInput: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: "#81C784",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#E8F5E9",
    minWidth: 60,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    color: "#2E7D32",
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  statLabel: {
    color: "#2E7D32",
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "bold",
  },
  noActivityText: {
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
