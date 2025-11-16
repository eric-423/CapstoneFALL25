import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import useCustomFonts from "@/hooks/useFonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
export default function TabLayout() {
  const { onLayoutRootView } = useCustomFonts();
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
              title: "Nhận đơn",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="filetext1" size={size - 1} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="manage"
            options={{
              title: "Quản lý",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="setting" size={size - 1} color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
