import { APP_COLOR } from "@/utils/constant";
import { StyleSheet, Text, View } from "react-native";
import ShareButton from "@/components/button/share.button";
import { router } from "expo-router";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";
import { AntDesign } from "@expo/vector-icons";

const OrderFailure = () => {
  const { setCart } = useCurrentApp();
  return (
    <>
      <View style={styles.containers}>
        <AntDesign name="close-circle" size={120} color={APP_COLOR.CANCEL} />
        <Text style={styles.topHeader}>Thanh toán thất bại</Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: APP_COLOR.BROWN,
            fontSize: 20,
            marginBottom: 10,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Đơn hàng của bạn chưa được thanh toán
        </Text>
        <View style={styles.btnView}>
          <ShareButton
            title="Về Trang Chủ"
            onPress={() => {
              setCart({});
              router.navigate("/(tabs)");
            }}
            btnStyle={{ backgroundColor: APP_COLOR.BROWN }}
            textStyle={styles.btnText}
          />
          <ShareButton
            title="Xem Đơn Hàng"
            onPress={() => router.navigate("/(tabs)/order.history")}
            btnStyle={{ backgroundColor: APP_COLOR.ORANGE }}
            textStyle={styles.btnText}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  topHeader: {
    fontSize: 25,
    fontFamily: FONTS.bold,
    color: APP_COLOR.CANCEL,
    marginTop: 20,
  },
  text: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    fontSize: 16,
    width: "95%",
    textAlign: "center",
    marginVertical: 10,
  },
  btnView: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  btnText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.regular,
    fontSize: 17,
  },
});

export default OrderFailure;
