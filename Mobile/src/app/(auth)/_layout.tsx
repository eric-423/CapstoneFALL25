import { Stack } from "expo-router";
import { APP_COLOR } from "@/utils/constant";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: APP_COLOR.ORANGE,
        headerTitleStyle: {
          color: "black",
          fontFamily: "Montserrat-SemiBold",
        },
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
