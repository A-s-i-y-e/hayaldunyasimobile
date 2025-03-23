import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            {/* Profil resmi buraya eklenecek */}
          </View>
        </View>
        <Text style={styles.username}>Kullanıcı Adı</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Hikayelerim</Text>
        {/* Hikaye listesi buraya eklenecek */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
});
