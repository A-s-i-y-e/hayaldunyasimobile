import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import TimeLimitService from "./services/TimeLimitService";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DrawScreen from "./screens/DrawScreen";
import StoriesScreen from "./screens/StoriesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import GamesScreen from "./screens/GamesScreen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import ProfileInfoScreen from "./screens/ProfileInfoScreen";
import SettingsScreen from "./screens/SettingsScreen";
import StatisticsScreen from "./screens/StatisticsScreen";
import AchievementsScreen from "./screens/AchievementsScreen";
import HelpSupportScreen from "./screens/HelpSupportScreen";
import AboutScreen from "./screens/AboutScreen";
import ParentalControlScreen from "./screens/ParentalControlScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import NewStoriesScreen from "./screens/NewStoriesScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import CreateStoryScreen from "./screens/CreateStoryScreen";
import StoryDetailScreen from "./screens/StoryDetailScreen";
import WordSearchScreen from "./screens/WordSearchScreen";
import MemoryGameScreen from "./screens/MemoryGameScreen";
import NumberGameScreen from "./screens/NumberGameScreen";
import PuzzleScreen from "./screens/PuzzleScreen";
import MyStoriesScreen from "./screens/MyStoriesScreen";
import EditStoryScreen from "./screens/EditStoryScreen";
import VoiceRecorderScreen from "./screens/VoiceRecorderScreen";

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Draw" component={DrawScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="MyStories" component={MyStoriesScreen} />
      <Stack.Screen name="NewStories" component={NewStoriesScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
      <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Games" component={GamesScreen} />
      <Stack.Screen name="VoiceRecorder" component={VoiceRecorderScreen} />
      {user && (
        <>
          <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen
            name="ParentalControl"
            component={ParentalControlScreen}
          />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="EditStory" component={EditStoryScreen} />
          <Stack.Screen name="WordSearch" component={WordSearchScreen} />
          <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
          <Stack.Screen name="NumberGame" component={NumberGameScreen} />
          <Stack.Screen name="Puzzle" component={PuzzleScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const navigationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        checkTimeLimit();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const checkTimeLimit = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "parentalControls", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().timeLimit) {
        const timeLimitMinutes = docSnap.data().timeLimitMinutes || 60;
        const lastActiveTime = new Date(docSnap.data().lastActiveTime);
        const now = new Date();
        const timeDiff = (now - lastActiveTime) / (1000 * 60); // dakika cinsinden fark

        if (timeDiff >= timeLimitMinutes) {
          Alert.alert(
            "Zaman Sınırı",
            "Günlük kullanım süreniz doldu. Ebeveyn paneline yönlendiriliyorsunuz.",
            [
              {
                text: "Tamam",
                onPress: () => {
                  if (navigationRef.current) {
                    navigationRef.current.reset({
                      index: 0,
                      routes: [{ name: "ParentalControl" }],
                    });
                  }
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Zaman sınırı kontrolü sırasında hata:", error);
    }
  };

  useEffect(() => {
    if (navigationRef.current) {
      TimeLimitService.setNavigation(navigationRef.current);
      TimeLimitService.startChecking();
    }

    return () => {
      TimeLimitService.stopChecking();
    };
  }, [navigationRef.current]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <VoiceProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="light" />
            <Navigation />
          </NavigationContainer>
        </VoiceProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E7D32",
  },
});
