import { StyleSheet } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.tint,
        dark: Colors.dark.tint,
      }}
      headerImage={
        <IconSymbol
          size={310}
          color={colorScheme === "light" ? "#FFFFFF" : "#FFFFFF"}
          name="paperplane.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Keşfet</ThemedText>
      </ThemedView>

      <Collapsible title="📅 Günün Hayali">
        <ThemedText style={styles.contentText}>
          Her gün yeni bir hayal keşfedin ve kendi hayallerinizi paylaşın.
        </ThemedText>
      </Collapsible>

      <Collapsible title="⭐ Popüler Hayaller">
        <ThemedText style={styles.contentText}>
          Topluluğun en çok beğenilen ve paylaşılan hayalleri burada!
        </ThemedText>
      </Collapsible>

      <Collapsible title="🎯 Hayal Kategorileri">
        <ThemedText style={styles.contentText}>
          • ✈️ Seyahat Hayalleri{"\n"}• 💼 Kariyer Hayalleri{"\n"}• 🌟 Yaşam
          Tarzı{"\n"}• 🎨 Hobiler ve İlgi Alanları{"\n"}• 📚 Kişisel Gelişim
        </ThemedText>
      </Collapsible>

      <Collapsible title="👥 Hayal Arkadaşları">
        <ThemedText style={styles.contentText}>
          Benzer hayallere sahip kişilerle tanışın ve hayallerinizi birlikte
          gerçekleştirin.
        </ThemedText>
      </Collapsible>

      <Collapsible title="📆 Hayal Takvimi">
        <ThemedText style={styles.contentText}>
          Hayallerinizi planlamak ve takip etmek için kişisel takvim oluşturun.
        </ThemedText>
      </Collapsible>

      <Collapsible title="💫 İlham Köşesi">
        <ThemedText style={styles.contentText}>
          Motivasyon hikayeleri ve başarıya ulaşmış hayallerin öyküleri burada.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#FFFFFF",
    bottom: -90,
    left: -35,
    position: "absolute",
    opacity: 0.8,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
