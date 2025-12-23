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
  const params = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;
  const promotionId =
    (params.promotionId as string) || (params.id as string) || "";
  const generateBarcodeUrl = (id: string) => {
    if (!id) return null;
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(
      id
    )}&code=Code128&translate-esc=on`;
  };

  const [voucher, setVoucher] = useState<any>({
    code: (params.code as string) || "VOUCHER",
    name: (params.name as string) || "Mã ưu đãi",
    description: (params.description as string) || "Mô tả ưu đãi",
    discountAmount: Number(params.discountAmount) || 0,
    endDate: (params.endDate as string) || "",
    minOrderAmount: Number(params.minOrderAmount) || 0,
    NumberCurrentUses: Number(params.usageCount) || 0,
    maxNumberOfUses: Number(params.maxNumberOfUses) || 1,
    isActive: params.isActive === "true" || false,
    promotionTypeName: (params.promotionTypeName as string) || "",
    barcode: generateBarcodeUrl(promotionId),
  });
  const formatDiscount = () => {
    const promotionTypeName = params.promotionTypeName as string;
    const discountAmount = voucher.discountAmount;
    if (promotionTypeName === "Giảm giá theo %") {
      return `${discountAmount}%`;
    } else if (promotionTypeName === "Giảm giá cố định") {
      return `${discountAmount.toLocaleString("vi-VN")}đ`;
    } else if (promotionTypeName === "Miễn phí vận chuyển") {
      return "Miễn phí vận chuyển";
    }
    return `${discountAmount.toLocaleString("vi-VN")}đ`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: APP_COLOR.WHITE }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
          flex: 0.3,
        }}
      >
        {voucher.barcode ? (
          <Image
            source={{ uri: voucher.barcode }}
            style={{ height: 170, width: screenWidth * 0.95 }}
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
            backgroundColor: APP_COLOR.ORANGE,
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
            {voucher.promotionTypeName}
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
          Giảm: {formatDiscount()}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: APP_COLOR.BROWN,
            fontSize: 13,
            marginBottom: 5,
          }}
        >
          HSD:{" "}
          {voucher.endDate
            ? new Date(voucher.endDate).toLocaleDateString("vi-VN")
            : ""}
        </Text>
      </View>
      <View style={{ marginHorizontal: 10, marginBottom: 40 }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            color: APP_COLOR.BROWN,
            fontSize: 18,
            marginBottom: 15,
          }}
        >
          Quy định sử dụng ưu đãi
        </Text>
        <View
          style={{
            backgroundColor: APP_COLOR.WHITE,
            borderRadius: 10,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã ưu đãi:</Text>
            <Text style={styles.value}>{voucher.code}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mô tả:</Text>
            <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>
              {voucher.description}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Loại khuyến mãi:</Text>
            <Text style={styles.value}>
              {voucher.promotionTypeName || "Không xác định"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá trị giảm:</Text>
            <Text style={[styles.value, { color: APP_COLOR.ORANGE }]}>
              {formatDiscount()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn tối thiểu:</Text>
            <Text style={styles.value}>
              {voucher.minOrderAmount?.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hạn sử dụng:</Text>
            <Text style={styles.value}>
              {voucher.endDate
                ? new Date(voucher.endDate).toLocaleDateString("vi-VN")
                : "Không có"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lần đã sử dụng:</Text>
            <Text style={styles.value}>
              {voucher.NumberCurrentUses} / {voucher.maxNumberOfUses}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 15,
                backgroundColor: voucher.isActive
                  ? APP_COLOR.DONE + "20"
                  : APP_COLOR.CANCEL + "20",
              }}
            >
              <Text
                style={[
                  styles.value,
                  {
                    color: voucher.isActive ? APP_COLOR.DONE : APP_COLOR.CANCEL,
                    fontFamily: FONTS.bold,
                  },
                ]}
              >
                {voucher.isActive ? "Còn hiệu lực" : "Hết hạn"}
              </Text>
            </View>
          </View>
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    fontSize: 14,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: APP_COLOR.GRAY + "30",
    marginVertical: 5,
  },
});
export default VoucherDetailsPage;
