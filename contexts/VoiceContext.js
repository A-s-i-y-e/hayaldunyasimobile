import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityKeyIOS,
  AVFormatIDKeyIOS,
} from "react-native-audio-recorder-player";
import { Platform } from "react-native";

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRecorderPlayerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initializeRecorder = async () => {
      try {
        if (!audioRecorderPlayerRef.current) {
          audioRecorderPlayerRef.current = new AudioRecorderPlayer();
          console.log("AudioRecorderPlayer instance created");

          if (isMounted) {
            setIsInitialized(true);
            console.log("AudioRecorderPlayer initialized successfully");
          }
        }
      } catch (e) {
        console.error("Failed to initialize AudioRecorderPlayer:", e);
        if (isMounted) {
          setError(e);
          setIsInitialized(false);
        }
      }
    };

    initializeRecorder();

    return () => {
      isMounted = false;
      if (audioRecorderPlayerRef.current) {
        try {
          audioRecorderPlayerRef.current.stopPlayer();
          audioRecorderPlayerRef.current.removePlayBackListener();
          audioRecorderPlayerRef.current.stopRecorder();
          audioRecorderPlayerRef.current.removeRecordBackListener();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!isInitialized) {
        throw new Error("Audio recorder not initialized. Please wait...");
      }

      if (!audioRecorderPlayerRef.current) {
        throw new Error("Audio recorder instance not found");
      }

      // Önceki kayıtları temizle
      await stopRecording();

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: "m4a",
        AudioEncodingBitRateAndroid: 128000,
        AudioSamplingRateAndroid: 44100,
      };

      const result = await audioRecorderPlayerRef.current.startRecorder(
        undefined,
        audioSet
      );
      audioRecorderPlayerRef.current.addRecordBackListener((e) => {
        console.log("Recording progress:", e.currentPosition);
      });
      setIsRecording(true);
      setError(null);
      console.log("Recording started successfully");
    } catch (e) {
      console.error("Recording error:", e);
      setError(e);
    }
  };

  const stopRecording = async () => {
    try {
      if (!audioRecorderPlayerRef.current) {
        throw new Error("Audio recorder not initialized");
      }

      if (!isRecording) {
        console.log("Recording already stopped");
        return;
      }

      const result = await audioRecorderPlayerRef.current.stopRecorder();
      audioRecorderPlayerRef.current.removeRecordBackListener();
      setIsRecording(false);
      setError(null);
      console.log("Recording stopped and saved at:", result);
      return result;
    } catch (e) {
      console.error("Stop recording error:", e);
      setError(e);
    }
  };

  const playRecording = async (uri) => {
    try {
      if (!audioRecorderPlayerRef.current) {
        throw new Error("Audio player not initialized");
      }

      if (isPlaying) {
        await stopPlaying();
      }

      const result = await audioRecorderPlayerRef.current.startPlayer(uri);
      audioRecorderPlayerRef.current.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          stopPlaying();
        }
      });
      setIsPlaying(true);
      setError(null);
      console.log("Playing started successfully");
    } catch (e) {
      console.error("Play error:", e);
      setError(e);
    }
  };

  const stopPlaying = async () => {
    try {
      if (!audioRecorderPlayerRef.current) {
        throw new Error("Audio player not initialized");
      }

      await audioRecorderPlayerRef.current.stopPlayer();
      audioRecorderPlayerRef.current.removePlayBackListener();
      setIsPlaying(false);
      console.log("Playback stopped successfully");
    } catch (e) {
      console.error("Stop playback error:", e);
      setError(e);
    }
  };

  const value = {
    isRecording,
    recordedAudio,
    isPlaying,
    error,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
  };

  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};
