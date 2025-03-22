import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  withSpring,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withSpring(isOpen ? "90deg" : "0deg") }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(isOpen ? 1000 : 0, { duration: 300 }),
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
    };
  });

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[styles.heading, isOpen && styles.headingOpen]}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Animated.View style={iconStyle}>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color={theme === "light" ? Colors.light.tint : Colors.dark.tint}
          />
        </Animated.View>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </TouchableOpacity>
      <Animated.View style={[styles.content, contentStyle]}>
        {children}
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  headingOpen: {
    backgroundColor: "#F0F0F0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
