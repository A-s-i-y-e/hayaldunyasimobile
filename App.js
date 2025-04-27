import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DrawScreen from "./screens/DrawScreen";
import StoriesScreen from "./screens/StoriesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import GamesScreen from "./screens/GamesScreen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
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
