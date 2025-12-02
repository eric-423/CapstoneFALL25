import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import useCustomFonts from "@/hooks/useFonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
export default function TabLayout() {
  const { onLayoutRootView } = useCustomFonts();
  const { appState } = useCurrentApp();
  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: APP_COLOR.ORANGE,
            tabBarInactiveTintColor: APP_COLOR.BROWN,
            tabBarStyle: {
              backgroundColor: APP_COLOR.WHITE,
              borderTopColor: APP_COLOR.WHITE,
              height: 60,
              paddingBottom: 5,
            },
            tabBarLabelStyle: {
              fontFamily: APP_FONT.REGULAR,
              fontSize: 12,
              marginBottom: 5,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Chấm công",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="clockcircleo" size={size - 1} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="shipping"
            options={{
              title: "Vận chuyển",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="filetext1" size={size - 1} color={color} />
              ),
              href: appState?.userInfo.role === "SHIPPER" ? undefined : null,
            }}
          />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
