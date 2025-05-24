import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Alert } from "react-native";

class TimeLimitService {
  static checkInterval = null;
  static navigation = null;

  static setNavigation = (nav) => {
    this.navigation = nav;
  };

  static startChecking = () => {
    // Her 5 saniyede bir kontrol et
    this.checkInterval = setInterval(() => this.checkTimeLimit(), 5000);
    // İlk kontrolü hemen yap
    this.checkTimeLimit();
  };

  static stopChecking = () => {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  };

  static checkTimeLimit = async () => {
    try {
      if (!auth.currentUser || !this.navigation) return;

      const userRef = doc(db, "parentalControls", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().timeLimit) {
        const lastActiveTime = new Date(docSnap.data().lastActiveTime);
        const timeLimitMinutes = docSnap.data().timeLimitMinutes || 60;
        const now = new Date();
        const timeDiff = Math.floor((now - lastActiveTime) / 1000 / 60);
        const remaining = timeLimitMinutes - timeDiff;

        console.log("Kalan süre:", remaining, "dakika");

        if (remaining <= 0) {
          // Önce zaman kontrolünü kapat
          await setDoc(
            userRef,
            {
              timeLimit: false,
              lastActiveTime: null,
            },
            { merge: true }
          );

          // Kullanıcıyı uyar ve ebeveyn paneline yönlendir
          Alert.alert(
            "Süre Doldu",
            "Günlük kullanım süreniz doldu. Ebeveyn paneline yönlendiriliyorsunuz.",
            [
              {
                text: "Tamam",
                onPress: () => {
                  // Ebeveyn paneline yönlendir
                  this.navigation.reset({
                    index: 0,
                    routes: [{ name: "ParentalControl" }],
                  });
                },
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error("Zaman kontrolü sırasında hata:", error);
    }
  };
}

export default TimeLimitService;
