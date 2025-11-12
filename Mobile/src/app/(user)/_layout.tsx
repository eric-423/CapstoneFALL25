import { Stack } from "expo-router";
import { APP_COLOR } from "@/utils/constant";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: APP_COLOR.ORANGE,
        headerTitleStyle: {
          color: "black",
          fontFamily: "Montserrat-SemiBold",
        },
      }}
    >
      <Stack.Screen
        name="account/info"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account/password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order/cart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order/place.order"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order/add.extra.food"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order/address.create"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
