  import { Stack } from "expo-router";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(auth)"
        options={{
          animation: "fade",
          animationDuration: 850,
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          animation: "fade",
          animationDuration: 850,
        }}
      />
    </Stack>
  );
}
