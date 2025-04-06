import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../config/firebase";
import { signOut, updateEmail, updatePassword } from "firebase/auth";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const profileItems = [
    {
      id: 1,
      title: "Yardım & Destek",
      icon: "help-circle",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
      screen: "HelpSupport",
    },
    {
      id: 2,
      title: "Hakkında",
      icon: "information",
      color: "#9C27B0",
      backgroundColor: "#F3E5F5",
      screen: "About",
    },
    {
      id: 3,
      title: "Ebeveyn Kontrolü",
      icon: "shield-account",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
      screen: "ParentalControl",
    },
    {
      id: 4,
      title: "Gizlilik",
      icon: "lock",
      color: "#F44336",
      backgroundColor: "#FFEBEE",
      screen: "Privacy",
    },
    {
      id: 5,
      title: "Ayarlar",
      icon: "cog",
      color: "#607D8B",
      backgroundColor: "#ECEFF1",
      screen: "Settings",
    },
  ];

  const stats = [
    {
      id: 1,
      title: "Hikayeler",
      value: "12",
      icon: "book-open-variant",
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
    },
    {
      id: 2,
      title: "Oyunlar",
      value: "8",
      icon: "gamepad-variant",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
    },
    {
      id: 3,
      title: "Çizimler",
      value: "5",
      icon: "pencil",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Hikaye Ustası",
      value: "3",
      icon: "book-open-variant",
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
    },
    {
      id: 2,
      title: "Oyun Şampiyonu",
      value: "2",
      icon: "gamepad-variant",
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
    },
    {
      id: 3,
      title: "Çizim Sanatçısı",
      value: "1",
      icon: "pencil",
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (email !== auth.currentUser?.email) {
        await updateEmail(auth.currentUser, email);
      }
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }
      Alert.alert("Başarılı", "Bilgileriniz güncellendi");
      setIsEditing(false);
      setPassword("");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/1995/1995577.png",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileRight}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>Kullanıcı Adı</Text>
              <TouchableOpacity style={styles.editInfoButton}>
                <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.credentialsContainer}>
              <View style={styles.credentialItem}>
                <MaterialCommunityIcons name="email" size={16} color="#fff" />
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-posta"
                    placeholderTextColor="#E8F5E9"
                  />
                ) : (
                  <Text style={styles.credentialText}>{email}</Text>
                )}
              </View>
              {isEditing && (
                <>
                  <View style={styles.credentialItem}>
                    <MaterialCommunityIcons
                      name="lock"
                      size={16}
                      color="#fff"
                    />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Mevcut Şifre"
                      placeholderTextColor="#E8F5E9"
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.credentialItem}>
                    <MaterialCommunityIcons
                      name="lock"
                      size={16}
                      color="#fff"
                    />
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Yeni Şifre"
                      placeholderTextColor="#E8F5E9"
                      secureTextEntry
                    />
                  </View>
                </>
              )}
            </View>
            {isEditing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdate}
                >
                  <Text style={styles.buttonText}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditing(false);
                    setPassword("");
                    setNewPassword("");
                  }}
                >
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
                <Text style={styles.editButtonText}>Bilgileri Düzenle</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Hakkımda</Text>
          <Text style={styles.aboutText}>
            Hayal Dünyam'da eğlenceli hikayeler okuyorum ve oyunlar oynuyorum!
          </Text>
          <TouchableOpacity style={styles.editAboutButton}>
            <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İstatistiklerim</Text>
          <View style={styles.horizontalScroll}>
            {stats.map((stat) => (
              <View
                key={stat.id}
                style={[
                  styles.smallCard,
                  { backgroundColor: stat.backgroundColor },
                ]}
              >
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={14}
                    color={stat.color}
                  />
                  <Text style={[styles.smallCardValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                </View>
                <Text style={[styles.smallCardTitle, { color: stat.color }]}>
                  {stat.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Başarılarım</Text>
          <View style={styles.horizontalScroll}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.smallCard,
                  { backgroundColor: achievement.backgroundColor },
                ]}
              >
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons
                    name={achievement.icon}
                    size={14}
                    color={achievement.color}
                  />
                  <Text
                    style={[
                      styles.smallCardValue,
                      { color: achievement.color },
                    ]}
                  >
                    {achievement.value}
                  </Text>
                </View>
                <Text
                  style={[styles.smallCardTitle, { color: achievement.color }]}
                >
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profileItems}>
          {profileItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.profileItem,
                { backgroundColor: item.backgroundColor },
              ]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.profileItemContent}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={30}
                  color={item.color}
                />
                <Text style={[styles.profileItemText, { color: item.color }]}>
                  {item.title}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={item.color}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  profileSection: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileLeft: {
    marginRight: 15,
  },
  profileRight: {
    flex: 1,
    justifyContent: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  editInfoButton: {
    marginLeft: 8,
  },
  aboutSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    width: "100%",
    position: "relative",
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 12,
    color: "#E8F5E9",
    lineHeight: 16,
  },
  editAboutButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 12,
    color: "#E8F5E9",
  },
  section: {
    padding: 4,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    marginLeft: 0,
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingVertical: 1,
    justifyContent: "space-between",
  },
  smallCard: {
    width: 95,
    height: 40,
    padding: 2,
    borderRadius: 8,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  smallCardValue: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  smallCardTitle: {
    fontSize: 8,
    textAlign: "center",
  },
  profileItems: {
    padding: 10,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileItemText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  signOutButton: {
    padding: 8,
    marginLeft: 8,
  },
  credentialsContainer: {
    marginTop: 10,
  },
  credentialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  credentialText: {
    fontSize: 12,
    color: "#E8F5E9",
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "#fff",
    marginLeft: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  editButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
  },
});
