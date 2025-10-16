import { Pressable, StyleSheet, Text, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";
import { APP_COLOR } from "@/utils/constant";

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    gap: 10,
    flexDirection: "row",
    borderRadius: 30,
    width: "95%",
    height: 45,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
    marginHorizontal: "auto",
  },
});
const SearchHome = () => {
  return (
    <View>
      <Pressable
        onPress={() => router.navigate("/(auth)/search")}
        style={styles.container}
      >
        <EvilIcons
          style={{ marginVertical: "auto", marginLeft: 10 }}
          name="search"
          size={20}
          color={APP_COLOR.BROWN}
        />
        <Text
          style={{
            color: APP_COLOR.BROWN,
            marginVertical: "auto",
          }}
        >
          Chọn món ăn bạn cần tìm
        </Text>
      </Pressable>
    </View>
  );
};

export default SearchHome;
