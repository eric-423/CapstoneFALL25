import { currencyFormatter } from "@/utils/cart";
import { jwtDecode } from "jwt-decode";
import { APP_COLOR, STATUS_COLORS } from "@/utils/constant";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useCallback, useState, useEffect } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { FONTS } from "@/theme/typography";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { formatDateToDDMMYYYY } from "@/utils/cart";
import HeaderHome from "@/components/home/header.home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAllOrder } from "@/utils/api";

interface Bank {
  id: number;
  name: string;
  code: string;
}
interface IOrderHistoryCus {
  orderId: number;
  order_create_at: string;
  payment_method: string;
  status: string;
  order_address: string;
  order_point_earn: number;
  order_amount: number;
  itemCount?: number;
}
interface StatusInfo {
  text: string;
  color: string;
}

interface ApiOrderResponse {
  id: number;
  orderStatus: string;
  orderDate: string;
  paymentTime: string | null;
  deliveryAt: string | null;
  customerName: string;
  customerPhone: string;
  address: string;
  branchName: string;
  branchAddress: string;
  subTotal: number;
  shippingFee: number;
  discountValue: number;
  amount: number;
  promotionCode: string;
  pointUsed: number;
  pointEarned: number;
  shipperName: string | null;
  waiterName: string | null;
  chefName: string | null;
  itemCount: number;
  table: boolean;
  pickUp: boolean;
}
const mapOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    CREATED: "Pending",
    IN_PROCESS: "Paid",
    APPROVED: "Approved",
    PREPARING: "Preparing",
    COOKED: "Cooked",
    DELIVERING: "Delivering",
    DELIVERED: "Delivered",
    CANCELED: "Canceled",
  };
  return statusMap[status] || status;
};

const OrderPage = () => {
  const [orderHistory, setOrderHistory] = useState<IOrderHistoryCus[]>([]);
  const [decodeToken, setDecodeToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<IOrderHistoryCus[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isBankDropdownVisible, setIsBankDropdownVisible] = useState(false);

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

  const fetchOrderHistoryWithToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedToken = await AsyncStorage.getItem("access_token");
      setToken(storedToken);

      if (!storedToken) {
        setOrderHistory([]);
        setIsLoading(false);
        return;
      }

      const response = await GetAllOrder();

      if (response.data && response.data.status === 0 && response.data.data) {
        const orders: IOrderHistoryCus[] = response.data.data.map(
          (order: ApiOrderResponse) => ({
            orderId: order.id,
            order_create_at: order.orderDate,
            payment_method: order.paymentTime
              ? "Thanh toán online"
              : "Tiền mặt",
            status: mapOrderStatus(order.orderStatus),
            order_address: order.address,
            order_point_earn: order.pointEarned,
            order_amount: order.amount,
            itemCount: order.itemCount,
          })
        );
        setOrderHistory(orders);
      } else {
        setOrderHistory([]);
      }
    } catch (err: any) {
      console.error("Error fetching order history:", err);
      setError(err?.response?.data?.desc || "Không thể tải lịch sử đơn hàng");
      setOrderHistory([]);
      Alert.alert(
        "Lỗi",
        err?.response?.data?.desc || "Không thể tải lịch sử đơn hàng"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const BankDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsBankDropdownVisible(!isBankDropdownVisible)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedBank ? selectedBank.name : "Chọn ngân hàng"}
          </Text>
          <MaterialCommunityIcons
            name={isBankDropdownVisible ? "chevron-up" : "chevron-down"}
            size={20}
            color={APP_COLOR.BROWN}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusInfo = statusMap[status] || {
      text: status,
      color: STATUS_COLORS.DEFAULT,
    };
    return (
      <View
        style={[styles.statusLayout, { backgroundColor: statusInfo.color }]}
      >
        <Text style={styles.statusText}>{statusInfo.text}</Text>
      </View>
    );
  };

  const handleViewDetails = (id: number) => {
    router.navigate({
      pathname: "/(user)/order/[id]",
      params: { id: id },
    });
  };

  const handleCancelOrder = (id: number) => {
    setSelectedOrderId(id);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrderId || !cancelReason || !bankName || !bankNumber) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }
  };
  const handleFeedback = (id: number) => {
    router.navigate({
      pathname: "/(user)/order/[id]",
      params: { id: id },
    });
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchId = parseInt(searchText.trim());

    if (isNaN(searchId)) {
      setSearchResults([]);
      setIsSearching(false);
      Alert.alert("Lỗi", "Vui lòng nhập số ID đơn hàng hợp lệ");
      return;
    }

    const foundOrder = orderHistory.find((order) => order.orderId === searchId);

    if (foundOrder) {
      setSearchResults([foundOrder]);
    } else {
      setSearchResults([]);
      Alert.alert(
        "Không tìm thấy",
        `Không tìm thấy đơn hàng với ID: ${searchId}`
      );
    }

    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      setToken(storedToken);
      if (storedToken) {
        const decoded = jwtDecode<any>(storedToken);
        setDecodeToken(decoded);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchOrderHistoryWithToken();
    }
  }, [token, fetchOrderHistoryWithToken]);

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      {token ? (
        <View style={{ flex: 1, paddingBottom: 40 }}>
          <View
            style={{
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
          >
            <HeaderHome pageName="orderHistory" />
            <View style={{ marginBottom: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: APP_COLOR.WHITE,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: APP_COLOR.BROWN,
                  borderRadius: 30,
                  marginHorizontal: 20,
                }}
              >
                <EvilIcons
                  style={{ marginVertical: "auto", marginLeft: 10 }}
                  name="search"
                  size={20}
                  color={APP_COLOR.BROWN}
                />
                <TextInput
                  style={{
                    flex: 1,
                    color: APP_COLOR.BROWN,
                    marginLeft: 10,
                    fontFamily: FONTS.regular,
                    fontSize: 14,
                  }}
                  placeholder="Nhập ID đơn hàng"
                  placeholderTextColor={APP_COLOR.BROWN}
                  value={searchText}
                  onChangeText={setSearchText}
                  keyboardType="numeric"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={clearSearch}
                    style={{ marginRight: 10 }}
                  >
                    <Text
                      style={{
                        color: APP_COLOR.ORANGE,
                        fontFamily: FONTS.bold,
                      }}
                    >
                      Xóa
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleSearch}
                  style={{
                    backgroundColor: APP_COLOR.ORANGE,
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
                  >
                    Tìm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, marginBottom: Platform.OS === "ios" ? -30 : -45 }}
          >
            {isLoading ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Đang tải...
              </Text>
            ) : orderHistory.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Không có đơn hàng nào
              </Text>
            ) : searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <View key={item.orderId}>
                  <View
                    style={{
                      padding: 10,
                      flexDirection: "row",
                      gap: 10,
                      backgroundColor: APP_COLOR.DARK_YELLOW,
                      borderRadius: 10,
                      width: "90%",
                      marginHorizontal: "auto",
                    }}
                  >
                    <View
                      style={{ gap: 10, width: 320, marginHorizontal: "auto" }}
                    >
                      <View
                        style={{
                          paddingVertical: "auto",
                          borderBottomWidth: 0.5,
                          borderColor: APP_COLOR.BROWN,
                          marginHorizontal: 5,
                          paddingBottom: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.orderText}>#{item.orderId}</Text>
                          <Text
                            style={{
                              color: APP_COLOR.BROWN,
                              fontSize: 15,
                              fontFamily: FONTS.medium,
                            }}
                          >
                            {item.payment_method}
                          </Text>
                        </View>
                        <Text style={styles.orderText}>
                          {formatDateToDDMMYYYY(item.order_create_at)}
                        </Text>
                      </View>
                      <View>
                        <StatusBadge status={item.status} />
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 5,
                            }}
                          >
                            <Text style={[styles.text, { width: 230 }]}>
                              {item.order_address}
                            </Text>
                            <Text
                              style={[styles.text, { color: APP_COLOR.ORANGE }]}
                            >
                              +{item.order_point_earn} điểm
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={styles.text}>
                              X{item.itemCount || 1} Sản phẩm
                            </Text>
                            <Text
                              style={[
                                styles.text,
                                {
                                  fontSize: 20,
                                  fontFamily: FONTS.bold,
                                  alignSelf: "flex-end",
                                },
                              ]}
                            >
                              {currencyFormatter(item.order_amount)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignSelf: "flex-end" }}
                      >
                        <View style={styles.container}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleViewDetails(item.orderId)}
                          >
                            <Text style={styles.buttonText}>Xem chi tiết</Text>
                          </TouchableOpacity>
                          {item.status === "Delivered" && (
                            <TouchableOpacity
                              style={[
                                styles.button,
                                { backgroundColor: APP_COLOR.ORANGE },
                              ]}
                              onPress={() => handleFeedback(item.orderId)}
                            >
                              <Text
                                style={[
                                  styles.buttonText,
                                  { color: APP_COLOR.WHITE },
                                ]}
                              >
                                Đánh giá
                              </Text>
                            </TouchableOpacity>
                          )}
                          {item.status === "Paid" && (
                            <TouchableOpacity
                              style={[
                                styles.button,
                                { backgroundColor: APP_COLOR.ORANGE },
                              ]}
                              onPress={() => handleCancelOrder(item.orderId)}
                            >
                              <Text
                                style={[
                                  styles.buttonText,
                                  { color: APP_COLOR.WHITE },
                                ]}
                              >
                                Hủy
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: 10 }} />
                </View>
              ))
            ) : (
              orderHistory.map((item, index) => (
                <View key={item.orderId}>
                  <View
                    style={{
                      padding: 10,
                      flexDirection: "row",
                      gap: 10,
                      backgroundColor: APP_COLOR.DARK_YELLOW,
                      borderRadius: 10,
                      width: "90%",
                      marginHorizontal: "auto",
                    }}
                  >
                    <View
                      style={{ gap: 10, width: 320, marginHorizontal: "auto" }}
                    >
                      <View
                        style={{
                          paddingVertical: "auto",
                          borderBottomWidth: 0.5,
                          borderColor: APP_COLOR.BROWN,
                          marginHorizontal: 5,
                          paddingBottom: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.orderText}>#{item.orderId}</Text>
                          <Text
                            style={{
                              color: APP_COLOR.BROWN,
                              fontSize: 15,
                              fontFamily: FONTS.medium,
                            }}
                          >
                            {item.payment_method}
                          </Text>
                        </View>
                        <Text style={styles.orderText}>
                          {formatDateToDDMMYYYY(item.order_create_at)}
                        </Text>
                      </View>
                      <View>
                        <StatusBadge status={item.status} />
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 5,
                            }}
                          >
                            <Text style={[styles.text, { width: 230 }]}>
                              {item.order_address}
                            </Text>
                            <Text
                              style={[styles.text, { color: APP_COLOR.ORANGE }]}
                            >
                              +{item.order_point_earn} điểm
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={styles.text}>
                              X{item.itemCount || 1} Sản phẩm
                            </Text>
                            <Text
                              style={[
                                styles.text,
                                {
                                  fontSize: 20,
                                  fontFamily: FONTS.bold,
                                  alignSelf: "flex-end",
                                },
                              ]}
                            >
                              {currencyFormatter(item.order_amount)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignSelf: "flex-end" }}
                      >
                        <View style={styles.container}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleViewDetails(item.orderId)}
                          >
                            <Text style={styles.buttonText}>Xem chi tiết</Text>
                          </TouchableOpacity>
                          {item.status === "Delivered" && (
                            <TouchableOpacity
                              style={[
                                styles.button,
                                { backgroundColor: APP_COLOR.ORANGE },
                              ]}
                              onPress={() => handleFeedback(item.orderId)}
                            >
                              <Text
                                style={[
                                  styles.buttonText,
                                  { color: APP_COLOR.WHITE },
                                ]}
                              >
                                Đánh giá
                              </Text>
                            </TouchableOpacity>
                          )}
                          {item.status === "Paid" && (
                            <TouchableOpacity
                              style={[
                                styles.button,
                                { backgroundColor: APP_COLOR.ORANGE },
                              ]}
                              onPress={() => handleCancelOrder(item.orderId)}
                            >
                              <Text
                                style={[
                                  styles.buttonText,
                                  { color: APP_COLOR.WHITE },
                                ]}
                              >
                                Hủy
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: 10 }} />
                </View>
              ))
            )}
          </ScrollView>
          <Pressable onPress={() => router.navigate("/(auth)/qrcode")}>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 20,
                backgroundColor: APP_COLOR.BROWN,
                borderRadius: 50,
                padding: 15,
                width: 60,
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={30}
                color={APP_COLOR.WHITE}
                style={{
                  marginHorizontal: "auto",
                  marginVertical: "auto",
                }}
              />
            </View>
          </Pressable>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: APP_COLOR.BROWN, fontFamily: FONTS.regular }}>
            Vui lòng đăng nhập để xem lịch sử đơn hàng.
          </Text>
        </View>
      )}
      <Modal
        visible={cancelModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hủy đơn hàng</Text>
            <Text style={styles.modalSubtitle}>
              Vui lòng điền thông tin để hoàn tiền
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Lý do hủy:</Text>
              <TextInput
                style={styles.textInput}
                value={cancelReason}
                onChangeText={setCancelReason}
                placeholder="Nhập lý do hủy đơn hàng"
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tên ngân hàng:</Text>
              <BankDropdown />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Số tài khoản:</Text>
              <TextInput
                style={styles.textInput}
                value={bankNumber}
                onChangeText={setBankNumber}
                placeholder="Nhập số tài khoản ngân hàng"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setCancelModalVisible(false);
                  setSelectedOrderId(null);
                  setCancelReason("");
                  setBankName("");
                  setBankNumber("");
                  setSelectedBank(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmCancel}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: APP_COLOR.BROWN,
    marginLeft: 5,
  },
  statusLayout: {
    width: 120,
    height: 25,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: APP_COLOR.WHITE,
  },
  container: {
    marginHorizontal: "auto",
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: APP_COLOR.WHITE,
    borderWidth: 0.5,
    borderColor: APP_COLOR.BROWN,
    borderRadius: 8,
    width: 100,
    height: 30,
    justifyContent: "center",
  },
  buttonText: {
    color: APP_COLOR.BROWN,
    fontSize: 13,
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
  orderText: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.BROWN,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 5,
  },
  modalSubtitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
    borderRadius: 8,
    padding: 10,
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: APP_COLOR.BROWN,
    backgroundColor: APP_COLOR.WHITE,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: APP_COLOR.ORANGE,
    borderWidth: 1,
    borderColor: APP_COLOR.ORANGE,
  },
  cancelButtonText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: APP_COLOR.BROWN,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
  },
  confirmButtonText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
    borderRadius: 8,
    padding: 12,
    backgroundColor: APP_COLOR.WHITE,
  },
  dropdownButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    flex: 1,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: APP_COLOR.WHITE,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1001,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
});

export default OrderPage;
