import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { useLocalSearchParams } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState } from "react";

const VoucherDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;
  const [voucher, setVoucher] = useState<any>({
    code: "VOUCHER2024",
    name: "Giảm giá 20% cho đơn hàng đầu tiên",
    description: "Áp dụng cho tất cả sản phẩm trong menu",
    discountAmount: 50000,
    endDate: "2024-12-31T23:59:59Z",
    minOrderAmount: 100000,
    NumberCurrentUses: 0,
    maxNumberOfUses: 1,
    isActive: true,
    barcode: "https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=BARCODE",
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: APP_COLOR.WHITE }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
          flex: 0.4,
        }}
      >
        {voucher.barcode ? (
          <Image
            source={{ uri: voucher.barcode }}
            style={{ height: 200, width: screenWidth }}
            resizeMode="contain"
          />
        ) : null}
      </View>
      <View
        style={{
          position: "relative",
          top: -20,
          backgroundColor: APP_COLOR.WHITE,
          marginHorizontal: 30,
          alignItems: "center",
          shadowColor: "#000",
          padding: 15,
          borderRadius: 10,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: APP_COLOR.CANCEL + "90",
            borderRadius: 30,
            alignItems: "center",
            marginHorizontal: "auto",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.medium,
              color: APP_COLOR.WHITE,
              fontSize: 13,
            }}
          >
            {voucher.code}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: FONTS.bold,
            textAlign: "center",
            fontSize: 20,
            marginBottom: 5,
          }}
        >
          {voucher.name}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.medium,
            textAlign: "center",
            marginBottom: 5,
          }}
        >
          {voucher.description}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: APP_COLOR.BROWN,
            fontSize: 15,
            marginBottom: 5,
          }}
        >
          Giảm: {voucher.discountAmount?.toLocaleString()}đ
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: APP_COLOR.BROWN,
            fontSize: 13,
          }}
        >
          HSD:{" "}
          {voucher.endDate
            ? new Date(voucher.endDate).toLocaleDateString()
            : ""}
        </Text>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <Text
          style={{
            fontFamily: FONTS.medium,
            color: APP_COLOR.BROWN,
            fontSize: 16,
            marginTop: 10,
          }}
        >
          Quy định sử dụng ưu đãi
        </Text>
        <View style={{ marginTop: 10, marginHorizontal: 10 }}>
          <Text style={styles.text}>
            + Đơn tối thiểu: {voucher.minOrderAmount?.toLocaleString()}đ
          </Text>
          <Text style={styles.text}>
            + Số lần sử dụng: {voucher.NumberCurrentUses} /{" "}
            {voucher.maxNumberOfUses}
          </Text>
          <Text style={styles.text}>
            + Trạng thái: {voucher.isActive ? "Còn hiệu lực" : "Hết hạn"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    marginVertical: 2.5,
  },
});
export default VoucherDetailsPage;
