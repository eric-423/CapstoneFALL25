import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import {
  currencyFormatter,
  formatDateTime,
  getStatusText,
} from "@/constants/Function";
import { useCurrentApp } from "@/context/app.context";
import { getShippingOrders } from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ShareButton from "../btnComponent/shareBtn";

interface OrderItemProps {
  order: IOrder;
  isExpanded: boolean;
  onToggle: () => void;
  isShipper?: boolean;
}

const OrderItemCard = ({
  order,
  isExpanded,
  onToggle,
  isShipper,
}: OrderItemProps) => {
  const spinValue = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.cardShadow}>
      <Pressable onPress={onToggle} style={styles.pressableContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.orderIdText}>
            Đơn hàng: ORD{order.id.toString().padStart(3, "0")}
          </Text>
          <View style={styles.iconContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <AntDesign name="caretdown" size={24} color={APP_COLOR.ORANGE} />
            </Animated.View>
          </View>
        </View>
        <View style={styles.customerInfoContainer}>
          <View>
            <Text style={styles.customerNameText}>
              Tên khách hàng: {order.customerName}
            </Text>
            <Text style={styles.text}>
              Đặt hàng: {formatDateTime(order.orderDate)}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {getStatusText(order.orderStatus)}
            </Text>
          </View>
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.detailsView}>
          <View style={styles.detailsSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="account-circle"
                size={24}
                color={APP_COLOR.BROWN}
              />
              <Text style={styles.boldText}>Thông tin khách hàng</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.text}>Họ Tên: {order.customerName}</Text>
              <Text style={styles.text}>SĐT: {order.customerPhone}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.text}>Địa chỉ:</Text>
              <Text style={styles.text}>{order.address}</Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              paddingBottom: 10,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            }}
          >
            <View style={styles.sectionHeader}>
              <Entypo name="credit-card" size={24} color={APP_COLOR.BROWN} />
              <Text style={styles.boldText}>Thanh toán & giao hàng</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.text}>
                Phương thức:{" "}
                {order.promotionCode
                  ? `Mã giảm giá: ${order.promotionCode}`
                  : "Chuyển khoản ngân hàng"}
              </Text>
              <Text style={styles.text}>
                Thời gian: {formatDateTime(order.paymentTime)}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              paddingBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.boldText}>Tổng đơn hàng:</Text>
            <Text style={styles.boldText}>
              {currencyFormatter(order.amount)} đ
            </Text>
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <AntDesign name="gift" size={24} color={APP_COLOR.BROWN} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { marginLeft: 5 }]}>
                  Điểm tích lũy:
                </Text>
                <Text
                  style={{
                    fontFamily: APP_FONT.SEMIBOLD,
                    color: APP_COLOR.ORANGE,
                    fontSize: 17,
                    marginLeft: 10,
                  }}
                >
                  +{order.pointEarned} điểm
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 5,
              paddingBottom: 10,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
              marginBottom: 10,
            }}
          >
            <Text style={styles.text}>Số lượng món: {order.itemCount}</Text>
            <Text style={styles.text}>Chi nhánh: {order.branchName}</Text>
          </View>
        </View>
      )}
      {isShipper && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <ShareButton
            onPress={() => router.push("/(auth)/map")}
            title="Xác nhận đơn"
            textStyle={{
              color: APP_COLOR.WHITE,
              fontFamily: APP_FONT.REGULAR,
            }}
            btnStyle={{
              marginVertical: 5,
              width: 130,
              justifyContent: "center",
            }}
          />
          <ShareButton
            onPress={() =>
              router.push({
                pathname: "/(auth)/shipperTrackingScreen",
                params: { orderId: order.id },
              })
            }
            title="Từ chối đơn"
            textStyle={{
              color: APP_COLOR.WHITE,
              fontFamily: APP_FONT.REGULAR,
            }}
            btnStyle={{
              marginVertical: 5,
              width: 130,
              justifyContent: "center",
              backgroundColor: APP_COLOR.CANCEL,
            }}
          />
        </View>
      )}
    </View>
  );
};

interface IConfirmOrder {
  isShipper?: boolean;
}
const OrderCard = (props: IConfirmOrder) => {
  const { appState } = useCurrentApp();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchOrders = async () => {
      if (!appState?.token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getShippingOrders(appState.token);
        if (response.status === 0 && response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [appState?.token]);

  const handleViewDetails = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (selectedOrderIndex === index) {
      setSelectedOrderIndex(null);
    } else {
      setSelectedOrderIndex(index);
    }
  };

  if (loading) {
    return (
      <View style={[styles.cardShadow, { padding: 20, alignItems: "center" }]}>
        <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
        <Text style={[styles.text, { marginTop: 10 }]}>
          Đang tải đơn hàng...
        </Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.cardShadow, { padding: 20, alignItems: "center" }]}>
        <Text style={styles.text}>Không có đơn hàng nào</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <Text style={[styles.boldText, { fontSize: 25, marginTop: 10 }]}>
          Đơn hàng
        </Text>
      </View>
      {orders.map((order, index) => (
        <OrderItemCard
          key={order.id}
          order={order}
          isExpanded={selectedOrderIndex === index}
          onToggle={() => handleViewDetails(index)}
          isShipper={props.isShipper}
        />
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  cardShadow: {
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: APP_COLOR.WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  pressableContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 10,
    zIndex: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderIdText: {
    color: APP_COLOR.BROWN,
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 19,
    flex: 1,
  },
  iconContainer: {},
  customerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
  },
  customerNameText: {
    color: APP_COLOR.BROWN,
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 15,
  },
  statusBadge: {
    height: 30,
    paddingHorizontal: 5,
    backgroundColor: "#DCFCE7",
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 11,
    color: "#065F46",
  },
  detailsView: {
    backgroundColor: APP_COLOR.WHITE,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,

    zIndex: 3,
  },
  detailsSection: {
    paddingBottom: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  infoColumn: {
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  boldText: {
    color: APP_COLOR.BROWN,
    fontFamily: APP_FONT.BOLD,
    fontSize: 17,
  },
  text: {
    color: APP_COLOR.BROWN,
    fontFamily: APP_FONT.REGULAR,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default OrderCard;
