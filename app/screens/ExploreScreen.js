import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Keşfet</Text>
      </View>
      <View style={styles.categories}>
        <Text style={styles.categoryTitle}>Kategoriler</Text>
        {/* Kategori listesi buraya eklenecek */}
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
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  categories: {
    padding: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
