import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { Button, Text, View } from "react-native";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { APP_COLOR } from "@/utils/constant";
import AppProvider from "@/context/app.context";

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, gap: 15 }}>
      <View
        style={{
          backgroundColor: "#333",
          padding: 10,
          borderRadius: 3,
          gap: 10,
        }}
      >
        <Text style={{ color: "red", fontSize: 20 }}>Something went wrong</Text>
        <Text style={{ color: "#fff" }}>{error.message}</Text>
      </View>
      <Button title="Try Again ?" onPress={retry} />
    </View>
  );
}

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Regular": require("@/assets/font/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("@/assets/font/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("@/assets/font/Montserrat-Bold.ttf"),
    "Montserrat-SemiBold": require("@/assets/font/Montserrat-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <RootSiblingParent>
        <AppProvider>
          <ThemeProvider value={navTheme}>
            <Stack
              screenOptions={{
                headerTintColor: APP_COLOR.ORANGE,
                headerTitleStyle: {
                  color: "black",
                  fontFamily: "Montserrat-SemiBold",
                },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(user)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </AppProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
