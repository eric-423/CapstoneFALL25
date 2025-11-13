import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { APP_COLOR } from "@/utils/constant";
import { StyleSheet, View } from "react-native";
import { FONTS } from "@/theme/typography";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
const TabLayout = () => {
  const getIcons = (routeName: string, focused: boolean, size: number) => {
    const styles = StyleSheet.create({
      qrIcon: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 30,
        elevation: 3,
      },
    });
    if (routeName === "index") {
      return (
        <MaterialCommunityIcons
          name="food-fork-drink"
          size={size}
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.BROWN}
        />
      );
    }
    if (routeName === "order") {
      return (
        <Ionicons
          name="restaurant-outline"
          size={24}
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.BROWN}
        />
      );
    }
    if (routeName === "ai") {
      return (
        <View style={styles.qrIcon}>
          <Octicons
            name="dependabot"
            size={24}
            color={focused ? APP_COLOR.ORANGE : APP_COLOR.BROWN}
          />
        </View>
      );
    }

    if (routeName === "order.history") {
      return focused ? (
        <AntDesign name="shopping-cart" size={24} color={APP_COLOR.ORANGE} />
      ) : (
        <AntDesign name="shopping-cart" size={24} color={APP_COLOR.BROWN} />
      );
    }
    if (routeName === "account") {
      return focused ? (
        <MaterialCommunityIcons
          name="account"
          size={size}
          color={APP_COLOR.ORANGE}
        />
      ) : (
        <MaterialCommunityIcons
          name="account-outline"
          size={size}
          color={APP_COLOR.BROWN}
        />
      );
    }
  };
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => {
          return getIcons(route.name, focused, size);
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarActiveTintColor: APP_COLOR.ORANGE,
        tabBarInactiveTintColor: APP_COLOR.BROWN,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 55,
          backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
          marginBottom: 50,
          paddingTop: 5,
          paddingBottom: 10,
        },
        tabBarLabel:
          route.name === "ai"
            ? "AI Chat"
            : route.name === "order"
            ? "Thực đơn"
            : route.name === "index"
            ? "Trang chủ"
            : route.name === "order.history"
            ? "Đơn hàng"
            : "Tôi",
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Thực đơn",
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI Chat",
        }}
      />
      <Tabs.Screen
        name="order.history"
        options={{
          title: "Đơn hàng",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Tôi",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
