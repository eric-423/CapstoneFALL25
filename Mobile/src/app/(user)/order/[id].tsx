import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { APP_COLOR, STATUS_COLORS } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { currencyFormatter } from "@/utils/cart";
import Entypo from "@expo/vector-icons/Entypo";
import { formatDateToDDMMYYYY } from "@/utils/cart";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GetOrderById, CompleteOrder } from "@/utils/api";
interface StatusInfo {
  text: string;
  color: string;
}

const statusMap: Record<string, StatusInfo> = {
  CREATED: { text: "Đã tạo đơn", color: STATUS_COLORS.PENDING },
  IN_PROCESS: { text: "Đang xử lý", color: STATUS_COLORS.APPROVED },
  COOKING: { text: "Đang nấu", color: STATUS_COLORS.COOKING },
  COOKED: { text: "Đã nấu xong", color: STATUS_COLORS.COOKED },
  SHIPPING: { text: "Đang giao hàng", color: STATUS_COLORS.DELIVERING },
  DELIVERED: { text: "Đã giao", color: STATUS_COLORS.DELIVERED },
  COMPLETED: { text: "Hoàn thành", color: STATUS_COLORS.DONE },
  CANCEL: { text: "Đã hủy", color: STATUS_COLORS.CANCELED },
  PAID: { text: "Đã thanh toán", color: STATUS_COLORS.APPROVED },
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
    productName: string;
    quantity: number;
    price: number;
  }[];
  order_shipping_fee: number;
  order_discount_value: number;
  order_amount: number;
  order_subtotal: number;
  invoiceUrl: string;
  order_point_earn: number;
  note: string | null;
  payment_method: string;
  isDatHo: boolean;
  tenNguoiDatHo: string | null;
  soDienThoaiNguoiDatHo: string | null;
  certificationOfDelivered: string | null;
  order_delivery_at: string | null;
  paymentUrl: string;
  billPdfUrl: string | null;
}

const mapApiOrderToState = (data: any): IOrderDetails => ({
  orderId: data?.id ?? 0,
  userId: data?.customerDTO?.id ?? 0,
  payment_time: data?.payment_time ?? data?.paymentTime ?? "",
  order_create_at: data?.createdAt ?? "",
  order_address: data?.address ?? "",
  status: (data?.orderStatus || data?.status || "").toUpperCase(),
  fullName: data?.customerName || data?.customerDTO?.fullName || "",
  phone_number: data?.phone || data?.customerDTO?.phone || "",
  orderItemsCount: data?.orderItems?.length ?? 0,
  orderItems:
    data?.orderItems?.map((item: any) => ({
      productId: item.productId,
      productName: item.productName || item.name || "Sản phẩm",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
    })) ?? [],
  order_shipping_fee: data?.shippingFee ?? 0,
  order_discount_value: data?.discountValue ?? 0,
  order_amount: data?.amount ?? 0,
  order_subtotal: data?.subTotal ?? 0,
  invoiceUrl: data?.invoiceUrl || data?.paymentUrl || "",
  order_point_earn: data?.pointEarned ?? 0,
  note: data?.note ?? "",
  payment_method:
    data?.payment_method ||
    data?.paymentMethod ||
    (data?.payment_code
      ? `Mã thanh toán: ${data.payment_code}`
      : "Thanh toán khi nhận hàng"),
  isDatHo: data?.isDatHo ?? false,
  tenNguoiDatHo: data?.tenNguoiDatHo ?? null,
  soDienThoaiNguoiDatHo: data?.soDienThoaiNguoiDatHo ?? null,
  certificationOfDelivered: data?.certificationOfDelivered ?? null,
  order_delivery_at: data?.delivery_at ?? data?.deliveryAt ?? null,
  paymentUrl: data?.paymentUrl ?? "",
  billPdfUrl: data?.billPdfUrl ?? null,
});

const OrderDetailsPage = () => {
  const { id } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState<IOrderDetails>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [pointEarned, setPointEarned] = useState(0);
  const orderIdParam = Array.isArray(id) ? id[0] : id;
  useEffect(() => {
    if (!orderIdParam) return;
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await GetOrderById(Number(orderIdParam));
        const data = response.data?.data || response.data;
        if (data) {
          setOrderDetails(mapApiOrderToState(data));
          setPointEarned(data?.pointEarned ?? 0);
        }
      } catch (fetchError) {
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderIdParam]);

  const normalizedStatus = orderDetails?.status
    ? orderDetails.status.toUpperCase()
    : "";

  const statusProgression = [
    "CREATED",
    "IN_PROCESS",
    "COOKING",
    "COOKED",
    "SHIPPING",
    "DELIVERED",
    "COMPLETED",
  ];

  const processingStatusIndex = statusProgression.indexOf("IN_PROCESS");
  const completedStatusIndex = statusProgression.indexOf("COMPLETED");

  const getCurrentStatusIndex = (status: string) => {
    const normalized = status === "CANCELED" ? "CANCEL" : status;
    if (normalized === "CANCEL") {
      return processingStatusIndex;
    }
    if (normalized === "PAID") {
      return completedStatusIndex;
    }
    return statusProgression.indexOf(normalized);
  };

  const currentStatusIndex =
    normalizedStatus !== "" ? getCurrentStatusIndex(normalizedStatus) : -1;

  const currentStatusInfo = statusMap[normalizedStatus] || {
    text: orderDetails?.status || "Đang cập nhật",
    color: STATUS_COLORS.DEFAULT,
  };

  const handleCompleteOrder = async () => {
    if (!orderDetails?.orderId) return;
    Alert.alert("Xác nhận", "Bạn có chắc chắn đã nhận được đơn hàng?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: async () => {
          try {
            setIsCompleting(true);
            await CompleteOrder(orderDetails.orderId);
            Alert.alert("Thành công", "Đơn hàng đã được xác nhận hoàn thành!");
            const response = await GetOrderById(Number(orderIdParam));
            const data = response.data?.data || response.data;
            if (data) {
              setOrderDetails(mapApiOrderToState(data));
            }
          } catch (error: any) {
            console.error("Error completing order:", error);
            Alert.alert(
              "Lỗi",
              error?.response?.data?.desc ||
                "Không thể hoàn thành đơn hàng. Vui lòng thử lại."
            );
          } finally {
            setIsCompleting(false);
          }
        },
      },
    ]);
  };

  const handleViewBill = () => {
    if (!orderDetails?.billPdfUrl) {
      Alert.alert("Lỗi", "Không tìm thấy hóa đơn");
      return;
    }

    router.navigate({
      pathname: "/(user)/order/bill.webview",
      params: { billUrl: orderDetails.billPdfUrl },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingHorizontal: 10 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={[styles.textContainer, { paddingTop: 40 }]}>
          <View style={styles.headerTitle}>
            <Text style={[styles.title, { textAlign: "center" }]}>
              Giao hàng đơn số {orderDetails?.orderId || orderIdParam}
            </Text>
          </View>
          {isLoading && (
            <Text style={styles.loadingText}>
              Đang tải thông tin đơn hàng...
            </Text>
          )}
          {!!error && !isLoading && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        <View style={styles.textContainer}>
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
                width: "45%",
              }}
            >
              <View style={{ alignItems: "center", marginRight: 8 }}>
                {statusProgression.map((status, idx) => {
                  const isOrderCanceled =
                    normalizedStatus === "CANCEL" ||
                    normalizedStatus === "CANCELED";
                  const isOrderPaid = normalizedStatus === "PAID";

                  if (isOrderCanceled && idx > processingStatusIndex) {
                    return null;
                  }

                  if (isOrderPaid && idx > completedStatusIndex) {
                    return null;
                  }

                  const isActive =
                    idx <= currentStatusIndex && currentStatusIndex >= 0;
                  const isCancelPosition =
                    isOrderCanceled && idx === processingStatusIndex;
                  const isPaidPosition =
                    isOrderPaid && idx === completedStatusIndex;

                  return (
                    <View key={status} style={{ alignItems: "center" }}>
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: isActive
                            ? isCancelPosition
                              ? APP_COLOR.CANCEL
                              : isPaidPosition
                              ? STATUS_COLORS.APPROVED
                              : APP_COLOR.BROWN
                            : APP_COLOR.BACKGROUND_ORANGE,
                          borderWidth: 2,
                          borderColor:
                            isCancelPosition && isActive
                              ? APP_COLOR.CANCEL
                              : isPaidPosition && isActive
                              ? STATUS_COLORS.APPROVED
                              : APP_COLOR.BROWN,
                          zIndex: 2,
                        }}
                      />
                      {idx < statusProgression.length - 1 &&
                        (!isOrderCanceled || idx < processingStatusIndex) &&
                        (!isOrderPaid || idx < completedStatusIndex) && (
                          <View
                            style={{
                              width: 3,
                              height: 24,
                              backgroundColor:
                                isActive && !isCancelPosition && !isPaidPosition
                                  ? APP_COLOR.BROWN
                                  : APP_COLOR.BACKGROUND_ORANGE,
                              zIndex: 1,
                            }}
                          />
                        )}
                    </View>
                  );
                })}
              </View>
              <View>
                {statusProgression.map((status, idx) => {
                  const isOrderCanceled =
                    normalizedStatus === "CANCEL" ||
                    normalizedStatus === "CANCELED";
                  const isOrderPaid = normalizedStatus === "PAID";

                  if (isOrderCanceled && idx > processingStatusIndex) {
                    return null;
                  }

                  if (isOrderPaid && idx > completedStatusIndex) {
                    return null;
                  }

                  const isCancelPosition =
                    isOrderCanceled && idx === processingStatusIndex;
                  const isPaidPosition =
                    isOrderPaid && idx === completedStatusIndex;
                  const isCurrentStatus = idx === currentStatusIndex;

                  if (isCancelPosition) {
                    return (
                      <Text
                        key={`cancel-${status}`}
                        style={{
                          color: APP_COLOR.CANCEL,
                          fontFamily: FONTS.bold,
                          marginBottom: Platform.OS === "android" ? 18 : 22,
                        }}
                      >
                        {statusMap.CANCEL?.text || "Đã hủy"}
                      </Text>
                    );
                  }

                  if (isPaidPosition) {
                    return (
                      <Text
                        key={`paid-${status}`}
                        style={{
                          color: STATUS_COLORS.APPROVED,
                          fontFamily: FONTS.bold,
                          marginBottom: Platform.OS === "android" ? 18 : 22,
                        }}
                      >
                        {statusMap.PAID?.text || "Đã thanh toán"}
                      </Text>
                    );
                  }

                  return (
                    <Text
                      key={status}
                      style={{
                        color: isCurrentStatus
                          ? APP_COLOR.ORANGE
                          : APP_COLOR.BROWN,
                        fontFamily: isCurrentStatus
                          ? FONTS.bold
                          : FONTS.regular,
                        marginBottom: Platform.OS === "android" ? 18 : 22,
                      }}
                    >
                      {statusMap[status]?.text || status}
                    </Text>
                  );
                })}
              </View>
            </View>
            <View
              style={{
                paddingBottom: 10,
                marginBottom: 4.5,
                width: "50%",
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
                  {orderDetails?.fullName}
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
                >
                  {orderDetails?.phone_number}
                </Text>
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
                    fontSize: 12,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  {orderDetails?.order_address}
                </Text>
              </View>

              <View>
                <Text style={styles.label}>Thời gian đặt hàng</Text>
                <Text style={styles.value}>
                  {formatDateToDDMMYYYY(orderDetails?.order_create_at || "")}
                </Text>
              </View>

              <View>
                <Text style={styles.label}>Hình thức</Text>
                <Text style={styles.value}>{orderDetails?.payment_method}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.labelIcon}>Chi tiết đơn hàng</Text>
          {orderDetails?.orderItems.map((item, index) => (
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
                    {item.productName}
                  </Text>
                  <Text style={[styles.itemValue]}>
                    {currencyFormatter(item.price)}
                  </Text>
                </View>
                <Text style={styles.itemValue}>Số lượng: {item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.label, { fontSize: 16 }]}>Tổng tiền</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.totalValue}>Thành tiền</Text>
            <Text style={styles.totalValue}>
              {currencyFormatter(
                orderDetails?.order_subtotal || orderDetails?.order_amount || 0
              )}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.totalValue}>Phí giao hàng</Text>
            <Text style={styles.totalValue}>
              {currencyFormatter(orderDetails?.order_shipping_fee)}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.totalValue}>Giảm giá</Text>
            <Text style={styles.totalValue}>
              -{currencyFormatter(orderDetails?.order_discount_value)}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.totalLabel}>Số tiền thanh toán</Text>
            <Text style={styles.totalLabel}>
              {currencyFormatter(
                orderDetails?.order_amount ||
                  0 +
                    (orderDetails?.order_shipping_fee || 0) -
                    (orderDetails?.order_discount_value || 0)
              )}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.totalLabel}>Điểm tích lũy</Text>
            <Text style={styles.totalLabel}>{pointEarned} điểm</Text>
          </View>
          <Text style={styles.label}>Ghi chú</Text>
          <Text style={styles.value}>
            {orderDetails?.note || "Không có ghi chú"}
          </Text>
        </View>

        <View style={styles.btnContainer}>
          <View style={styles.buttonContainer}>
            {orderDetails?.status === "CREATED" && (
              <TouchableOpacity
                style={[
                  styles.buttonFooter,
                  {
                    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                    borderWidth: 1,
                    borderColor: APP_COLOR.BROWN,
                  },
                ]}
                onPress={() => {
                  if (orderDetails?.paymentUrl) {
                    router.navigate({
                      pathname: "/(user)/order/payment.webview",
                      params: { paymentUrl: orderDetails.paymentUrl },
                    });
                  } else {
                    Alert.alert(
                      "Lỗi",
                      "Không tìm thấy URL thanh toán. Vui lòng thử lại sau."
                    );
                  }
                }}
              >
                <Text style={[styles.buttonText, { color: APP_COLOR.BROWN }]}>
                  Thanh toán
                </Text>
              </TouchableOpacity>
            )}
            {orderDetails?.status === "SHIPPING" && orderDetails?.orderId && (
              <TouchableOpacity
                style={[
                  styles.buttonFooter,
                  {
                    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                    borderWidth: 1,
                    borderColor: APP_COLOR.BROWN,
                  },
                ]}
                onPress={() =>
                  router.navigate({
                    pathname: "/(user)/order/track/[id]",
                    params: { id: String(orderDetails.orderId) },
                  })
                }
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: APP_COLOR.BROWN, textAlign: "center" },
                  ]}
                >
                  Theo dõi đơn
                </Text>
              </TouchableOpacity>
            )}
            {normalizedStatus === "DELIVERED" && orderDetails?.orderId && (
              <TouchableOpacity
                style={[
                  styles.buttonFooter,
                  {
                    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                    borderWidth: 1,
                    borderColor: APP_COLOR.BROWN,
                  },
                ]}
                onPress={handleCompleteOrder}
                disabled={isCompleting}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: APP_COLOR.BROWN, textAlign: "center" },
                  ]}
                >
                  {isCompleting ? "Đang xử lý..." : "Đã nhận đơn"}
                </Text>
              </TouchableOpacity>
            )}
            {normalizedStatus === "COMPLETED" && orderDetails?.billPdfUrl && (
              <TouchableOpacity
                style={[
                  styles.buttonFooter,
                  {
                    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                    borderWidth: 1,
                    borderColor: APP_COLOR.BROWN,
                  },
                ]}
                onPress={handleViewBill}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: APP_COLOR.BROWN, textAlign: "center" },
                  ]}
                >
                  Xem hóa đơn
                </Text>
              </TouchableOpacity>
            )}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    paddingVertical: 35,
    paddingHorizontal: 16,
  },
  textContainer: {
    backgroundColor: APP_COLOR.WHITE,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  btnContainer: {
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  headerTitle: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginVertical: "auto",
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
  },
  detailsContainer: { flexDirection: "row", justifyContent: "space-between" },
  label: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    width: 170,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
  },
  statusLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    width: 200,
    marginVertical: "auto",
  },
  value: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    width: 180,
  },
  totalValue: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
  },
  customerValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: APP_COLOR.BROWN,
    marginHorizontal: 2,
  },
  itemContainer: {
    marginVertical: 4,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  itemValue: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
  },
  statusLayout: {
    width: 130,
    height: 30,
    position: "relative",
    left: 5,
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
    fontSize: 13,
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
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginHorizontal: "auto",
  },
  loadingText: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    marginBottom: 10,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.ORANGE,
    marginBottom: 10,
  },
});

export default OrderDetailsPage;
