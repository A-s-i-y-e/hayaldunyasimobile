import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawingScreen() {
  const [paths, setPaths] = useState([]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvas}>
        {/* Canvas bileşeni buraya eklenecek */}
      </View>
      <View style={styles.toolbar}>
        {/* Çizim araçları buraya eklenecek */}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  toolbar: {
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
