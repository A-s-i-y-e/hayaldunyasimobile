import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !username) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
        profileImage: "",
        bio: "",
        dreams: 0,
        followers: 0,
        following: 0,
      });

      navigation.replace("Home");
    } catch (error) {
      let errorMessage = "Kayıt olurken bir hata oluştu";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Bu e-posta adresi zaten kullanılıyor";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Şifre çok zayıf";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>✨ Hayal Dünyası</Text>
              <Text style={styles.subtitle}>Yeni Hesap Oluştur</Text>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />
                <TextInput
                  style={styles.input}
                  placeholder="Kullanıcı Adı"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email" size={20} color="#fff" />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock" size={20} color="#fff" />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-check"
                  size={20}
                  color="#fff"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kayıt Ol</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#E8F5E9",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: "#fff",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#E8F5E9",
    fontSize: 14,
  },
  loginLink: {
    color: "#A5D6A7",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#81C784",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
