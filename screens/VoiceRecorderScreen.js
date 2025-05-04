import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useVoice } from "../contexts/VoiceContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const VoiceRecorderScreen = () => {
  const {
    isRecording,
    recordedAudio,
    isPlaying,
    error,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
  } = useVoice();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ses Kaydedici</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Icon
            name={isRecording ? "stop" : "mic"}
            size={30}
            color={isRecording ? "#ff4444" : "#4CAF50"}
          />
          <Text style={styles.buttonText}>
            {isRecording ? "Kaydı Durdur" : "Kayda Başla"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isPlaying && styles.playingButton]}
          onPress={() => playRecording(recordedAudio)}
          disabled={!recordedAudio}
        >
          <Icon
            name={isPlaying ? "stop" : "play-arrow"}
            size={30}
            color={isPlaying ? "#ff4444" : "#2196F3"}
          />
          <Text style={styles.buttonText}>
            {isPlaying ? "Oynatmayı Durdur" : "Kaydı Oynat"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordingButton: {
    backgroundColor: "#ffebee",
  },
  playingButton: {
    backgroundColor: "#e3f2fd",
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  error: {
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default VoiceRecorderScreen;
