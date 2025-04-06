import React, { useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function ParentalControlScreen() {
  const [controls, setControls] = useState({
    timeLimit: true,
    activityMonitor: true,
  });
  const [timeLimitModal, setTimeLimitModal] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("60");
  const [activityModal, setActivityModal] = useState(false);
  const [activityData, setActivityData] = useState([]);

  const toggleSwitch = async (key) => {
    try {
      const newControls = { ...controls, [key]: !controls[key] };
      setControls(newControls);

      // Firebase'e kaydet
      const userRef = doc(db, "parentalControls", auth.currentUser.uid);
      await setDoc(userRef, newControls, { merge: true });
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Ayarlar kaydedilirken bir hata oluştu");
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
      await setDoc(userRef, { timeLimitMinutes: minutes }, { merge: true });

      setTimeLimitModal(false);
      Alert.alert("Başarılı", "Günlük kullanım süresi güncellendi");
    } catch (error) {
      console.error("Süre limiti kaydedilirken hata oluştu:", error);
      Alert.alert("Hata", "Süre limiti kaydedilirken bir hata oluştu");
    }
  };

  const loadActivityData = async () => {
    try {
      const userRef = doc(db, "activityLogs", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setActivityData(docSnap.data().logs || []);
      }
      setActivityModal(true);
    } catch (error) {
      console.error("Aktivite verileri yüklenirken hata oluştu:", error);
      Alert.alert("Hata", "Aktivite verileri yüklenirken bir hata oluştu");
    }
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

      <Modal visible={timeLimitModal} transparent={true} animationType="slide">
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

      <Modal visible={activityModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aktivite Geçmişi</Text>
            <ScrollView style={styles.activityList}>
              {activityData.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityText}>
                    {activity.date}: {activity.action}
                  </Text>
                </View>
              ))}
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activityText: {
    color: "#333",
  },
});
