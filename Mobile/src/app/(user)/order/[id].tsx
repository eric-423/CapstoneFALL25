import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { currencyFormatter } from "@/utils/cart";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { formatDateToDDMMYYYY } from "@/utils/cart";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
interface StatusInfo {
  text: string;
  color: string;
}

const STATUS_COLORS = {
  PENDING: "rgba(52, 55, 252, 0.75)",
  APPROVED: "rgba(0, 154, 5, 0.68)",
  PREPARING: "rgba(255, 251, 0, 0.75)",
  COOKED: APP_COLOR.ORANGE,
  DELIVERING: "rgba(3, 169, 244, 0.72)",
  DELIVERED: "rgba(76, 175, 80, 0.70)",
  CANCELED: "rgba(244, 67, 54, 0.70)",
  DEFAULT: "rgba(158, 158, 158, 0.70)",
};

const statusMap: Record<string, StatusInfo> = {
  Pending: { text: "Chờ thanh toán", color: STATUS_COLORS.PENDING },
  Paid: { text: "Đã thanh toán", color: STATUS_COLORS.APPROVED },
  Approved: { text: "Đã xác nhận", color: STATUS_COLORS.APPROVED },
  Preparing: { text: "Đang chuẩn bị", color: STATUS_COLORS.PREPARING },
  Cooked: { text: "Đã nấu xong", color: STATUS_COLORS.COOKED },
  Delivering: { text: "Đang giao", color: STATUS_COLORS.DELIVERING },
  Delivered: { text: "Đã giao", color: STATUS_COLORS.DELIVERED },
  Canceled: { text: "Đã hủy", color: STATUS_COLORS.CANCELED },
};

interface IOrderDetails {
  orderId: number;
  userId: number;
  payment_time: string;
  order_create_at: string;
  order_address: string;
  status: string;
  fullName: string;
  phone_number: string;
  orderItemsCount: number;
  orderItems: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  order_shipping_fee: number;
  order_discount_value: number;
  order_amount: number;
  order_subtotal: number;
  invoiceUrl: string;
  order_point_earn: number;
  note: string;
  payment_method: string;
  isDatHo: boolean;
  tenNguoiDatHo: string | null;
  soDienThoaiNguoiDatHo: string | null;
  certificationOfDelivered: string | null;
  order_delivery_at: string | null;
}

const OrderDetailsPage = () => {
  const { id } = useLocalSearchParams();

  const [orderDetails, setOrderDetails] = useState<IOrderDetails>({
    orderId: 12345,
    userId: 1,
    payment_time: "2024-01-15T10:30:00Z",
    order_create_at: "2024-01-15T10:00:00Z",
    order_address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    status: "Delivering",
    fullName: "Nguyễn Văn A",
    phone_number: "0123456789",
    orderItemsCount: 3,
    orderItems: [
      {
        productId: 1,
        name: "Cơm tấm sườn nướng",
        quantity: 2,
        price: 45000,
      },
      {
        productId: 2,
        name: "Canh chua cá bông lau",
        quantity: 1,
        price: 35000,
      },
      {
        productId: 3,
        name: "Nước ngọt",
        quantity: 2,
        price: 15000,
      },
    ],
    order_shipping_fee: 15000,
    order_discount_value: 10000,
    order_amount: 125000,
    order_subtotal: 125000,
    invoiceUrl: "",
    order_point_earn: 12,
    note: "Giao hàng vào buổi chiều",
    payment_method: "Thanh toán khi nhận hàng",
    isDatHo: false,
    tenNguoiDatHo: null,
    soDienThoaiNguoiDatHo: null,
    certificationOfDelivered: null,
    order_delivery_at: null,
  });

  const statusProgression = [
    "Pending",
    "Paid",
    "Approved",
    "Preparing",
    "Cooked",
    "Delivering",
    "Delivered",
  ];

  const getCurrentStatusIndex = (status: string) => {
    if (status === "Canceled") return statusProgression.length;
    return statusProgression.indexOf(status);
  };

  const currentStatusIndex = orderDetails
    ? getCurrentStatusIndex(orderDetails.status)
    : -1;

  const currentStatusInfo = statusMap[orderDetails.status] || {
    text: orderDetails.status,
    color: STATUS_COLORS.DEFAULT,
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Giao hàng #{id}</Text>
          </View>
          <View style={styles.contentItems}>
            <View>
              <Text style={styles.label}>Thời gian đặt hàng</Text>
              <Text style={styles.value}>
                {formatDateToDDMMYYYY(orderDetails.order_create_at)}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Hóa đơn</Text>
              <Text style={styles.value}>{orderDetails.orderId}</Text>
            </View>
          </View>
          <View style={styles.contentItems}>
            <View>
              <Text style={styles.label}>Hình thức</Text>
              <Text style={styles.value}>{orderDetails.payment_method}</Text>
            </View>
            <View>
              <Text style={styles.label}>Địa chỉ</Text>
              <Text style={styles.value}>{orderDetails.order_address}</Text>
            </View>
          </View>
          <View style={styles.orderDetailsStatus}>
            <Text style={styles.statusLabel}>Trạng thái đơn hàng</Text>
            <View style={styles.statusLayout}>
              <View
                style={[
                  styles.statusLayout,
                  {
                    backgroundColor: currentStatusInfo.color,
                    borderRadius: 50,
                  },
                ]}
              >
                <Text style={[styles.statusText, { color: APP_COLOR.WHITE }]}>
                  {currentStatusInfo.text}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginVertical: 10,
                marginBottom: 5,
                borderBottomColor: APP_COLOR.BROWN,
                borderBottomWidth: 0.5,
                width: "45%",
              }}
            >
              <View style={{ alignItems: "center", marginRight: 8 }}>
                {statusProgression.map((status, idx) => (
                  <View key={status} style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor:
                          idx <= currentStatusIndex &&
                          orderDetails.status !== "Canceled"
                            ? APP_COLOR.BROWN
                            : APP_COLOR.BACKGROUND_ORANGE,
                        borderWidth: 2,
                        borderColor: APP_COLOR.BROWN,
                        zIndex: 2,
                      }}
                    />
                    {idx < statusProgression.length - 1 && (
                      <View
                        style={{
                          width: 3,
                          height: 24,
                          backgroundColor: APP_COLOR.BROWN,
                          zIndex: 1,
                        }}
                      />
                    )}
                  </View>
                ))}
              </View>
              <View>
                {statusProgression.map((status, idx) => (
                  <Text
                    key={status}
                    style={{
                      color:
                        idx === currentStatusIndex &&
                        orderDetails.status !== "Canceled"
                          ? APP_COLOR.ORANGE
                          : APP_COLOR.BROWN,
                      fontFamily:
                        idx === currentStatusIndex &&
                        orderDetails.status !== "Canceled"
                          ? FONTS.bold
                          : FONTS.regular,
                      marginBottom: Platform.OS === "android" ? 18 : 22,
                    }}
                  >
                    {statusMap[status].text}
                  </Text>
                ))}
                {orderDetails.status === "Canceled" && (
                  <Text
                    style={{
                      color: APP_COLOR.ORANGE,
                      fontFamily: FONTS.bold,
                      marginBottom: Platform.OS === "android" ? 18 : 22,
                    }}
                  >
                    {statusMap.Canceled.text}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                borderBottomColor: APP_COLOR.BROWN,
                borderBottomWidth: 0.5,
                paddingBottom: 10,
                marginBottom: 10,
                width: "54%",
                gap: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 8,
                }}
              >
                <MaterialIcons
                  name="account-circle"
                  size={20}
                  color={APP_COLOR.ORANGE}
                />
                <Text style={styles.customerValue}>
                  {orderDetails.fullName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <FontAwesome5
                  name="phone-alt"
                  size={16}
                  color={APP_COLOR.ORANGE}
                />
                <Text
                  style={[
                    styles.customerValue,
                    { color: APP_COLOR.ORANGE, fontFamily: FONTS.regular },
                  ]}
                >{`(${orderDetails.phone_number})`}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Entypo
                  name="location-pin"
                  size={20}
                  color={APP_COLOR.ORANGE}
                  style={{
                    marginBottom: 5,
                  }}
                />
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 14,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  {orderDetails.order_address}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: APP_COLOR.BROWN,
              borderBottomWidth: 0.5,
              paddingBottom: 10,
              marginBottom: 10,
            }}
          >
            <Text style={styles.labelIcon}>Chi tiết đơn hàng</Text>
            {orderDetails.orderItems.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 125,
                    }}
                  >
                    <Text
                      style={[
                        styles.itemValue,
                        { fontFamily: FONTS.bold, width: "50%" },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={[styles.itemValue]}>
                      {currencyFormatter(item.price)}
                    </Text>
                  </View>
                  <Text style={styles.itemValue}>
                    Số lượng: {item.quantity}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              borderBottomColor: APP_COLOR.BROWN,
              borderBottomWidth: 0.5,
              paddingBottom: 10,
              marginBottom: 10,
            }}
          >
            <Text style={[styles.label, { fontSize: 19 }]}>Tổng tiền</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.totalValue}>Thành tiền</Text>
              <Text style={styles.totalValue}>
                {currencyFormatter(orderDetails.order_amount)}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.totalValue}>Phí giao hàng</Text>
              <Text style={styles.totalValue}>
                {currencyFormatter(orderDetails.order_shipping_fee)}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.totalValue}>Giảm giá</Text>
              <Text style={styles.totalValue}>
                {currencyFormatter(orderDetails.order_discount_value)}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.totalLabel}>Số tiền thanh toán</Text>
              <Text style={styles.totalLabel}>
                {currencyFormatter(
                  orderDetails.order_amount +
                    orderDetails.order_shipping_fee -
                    orderDetails.order_discount_value
                )}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.totalLabel}>Điểm tích lũy</Text>
              <Text style={styles.totalLabel}>
                {(orderDetails.order_amount +
                  orderDetails.order_shipping_fee -
                  orderDetails.order_discount_value) /
                  1000}{" "}
                điểm
              </Text>
            </View>
          </View>
          <Text style={[styles.label, { width: "100%" }]}>
            Phương thức thanh toán
          </Text>
          <Text style={styles.value}>{orderDetails.payment_method}</Text>
          <Text style={styles.label}>Ghi chú</Text>
          <Text style={styles.value}>{orderDetails.note}</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.buttonFooter,
                  { backgroundColor: APP_COLOR.ORANGE },
                ]}
                onPress={() => router.navigate("/(tabs)")}
              >
                <Text style={[styles.buttonText, { color: APP_COLOR.WHITE }]}>
                  Về trang chủ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  headerTitle: {
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    marginVertical: "auto",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
  },
  detailsContainer: { flexDirection: "row", justifyContent: "space-between" },
  label: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    width: 170,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
  },
  statusLabel: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    width: 200,
    marginVertical: "auto",
  },
  value: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    width: 180,
  },
  totalValue: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
  },
  customerValue: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: APP_COLOR.BROWN,
    marginHorizontal: 2,
  },
  itemContainer: {
    marginVertical: 8,
    justifyContent: "space-between",
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    flexDirection: "row",
  },
  contentItems: {
    flexDirection: "row",
  },
  itemValue: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
  },
  statusLayout: {
    width: 130,
    height: 30,
  },
  orderDetailsStatus: {
    flexDirection: "row",
    marginTop: 7,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    marginHorizontal: "auto",
    marginVertical: "auto",
  },
  labelIcon: {
    color: APP_COLOR.BROWN,
    fontSize: 14,
    fontFamily: FONTS.bold,
    alignSelf: "center",
  },
  buttonContainer: {
    marginHorizontal: "auto",
    flexDirection: "row",
    gap: 10,
  },
  buttonFooter: {
    backgroundColor: APP_COLOR.WHITE,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 180,
    marginTop: 10,
    height: 42,
    alignItems: "center",
  },
  buttonText: {
    color: APP_COLOR.BROWN,
    fontSize: 17,
    fontFamily: FONTS.bold,
    marginHorizontal: "auto",
  },
});

export default OrderDetailsPage;
