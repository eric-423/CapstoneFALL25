import { useCurrentApp } from "@/context/app.context";
import { FONTS } from "@/theme/typography";
import { currencyFormatter } from "@/utils/cart";
import { calculateTotalPrice } from "@/utils/cart";
import { APP_COLOR } from "@/utils/constant";
import { useEffect, useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import { ChangePasswordSchema } from "@/utils/validate.schema";
import CustomerInforInput from "@/components/input/customerInfo.input";
import ShareButton from "@/components/button/share.button";
import HeaderHome from "@/components/home/header.home";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import DropDown from "@/components/order/item.dropdown";
import { router, useFocusEffect } from "expo-router";
import {
  GetCustomerInformation,
  GetShippingFee,
  CreateOrder,
  GetBranchInfo,
  GetAvailablePromotion,
  GetBranchNearLocation,
  GetOrderById,
} from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IOrderItem {
  title: string;
  price: number;
  quantity: number;
  productId: number;
}

const PlaceOrderPage = () => {
  const { restaurant, cart, appState } = useCurrentApp();
  const orderItems: IOrderItem[] =
    restaurant?._id && cart?.[restaurant._id]?.items
      ? Object.values(cart[restaurant._id].items).map((item) => ({
          title: item.data.title || item.data.name || "",
          price: (item.data.basePrice || item.data.price) * item.quantity,
          quantity: item.quantity,
          productId: Number(item.data.productId) || 0,
        }))
      : [];
  const [loading, setLoading] = useState<boolean>(false);
  const [branchAddress, setBranchAddress] = useState("");
  const { branchId, branchName } = useCurrentApp();
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [originalShippingFee, setOriginalShippingFee] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [availablePromotions, setAvailablePromotions] = useState<any[]>([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  const [customerInformation, setCustomerInformation] = useState<any>(null);
  const [allAddresses, setAllAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [canShip, setCanShip] = useState(false);
  const [orderMode, setOrderMode] = useState<"SHIPPING" | "PICKUP">("SHIPPING");
  const [distance, setDistance] = useState<number | null>(null);
  const [pointUsed, setPointUsed] = useState<number>(
    appState?.userInfo?.memberPoint || 0
  );
  const [pointsToUse, setPointsToUse] = useState<string>("");
  const [pointDiscountAmount, setPointDiscountAmount] = useState<number>(0);
  useEffect(() => {
    const currentPoints = appState?.userInfo?.memberPoint || 0;
    setPointUsed(currentPoints);
    if (Number(pointsToUse) > currentPoints) {
      setPointsToUse("");
      setPointDiscountAmount(0);
    }
  }, [appState?.userInfo?.memberPoint, pointsToUse]);

  useEffect(() => {
    const fetchBranchInfo = async () => {
      if (!branchId) {
        return;
      }
      const res = await GetBranchInfo(branchId);
      setBranchAddress(res?.data?.address);
    };
    fetchBranchInfo();
    const fetchShippingFee = async () => {
      if (orderMode === "PICKUP") {
        setShippingFee(0);
        setDistance(null);
        return;
      }
      if (!customerInformation?.address || !branchAddress) {
        setDistance(null);
        return;
      }
      try {
        const storedDistance = await AsyncStorage.getItem("distance");
        if (storedDistance) {
          setDistance(parseFloat(storedDistance));
        } else {
          try {
            const branchRes = await GetBranchNearLocation(
              customerInformation.address
            );
            const branches = branchRes.data?.data || branchRes.data || [];
            const currentBranch = branches.find((b: any) => b.id === branchId);
            if (currentBranch?.distanceInMeters) {
              const distanceInKm = currentBranch.distanceInMeters / 1000;
              setDistance(distanceInKm);
              await AsyncStorage.setItem("distance", distanceInKm.toString());
            }
          } catch (e) {
            console.error("Error getting distance:", e);
          }
        }

        const res = await GetShippingFee(
          customerInformation.address,
          branchAddress
        );
        const fee = res.data.data || 0;
        setShippingFee(fee);
        setOriginalShippingFee(fee);
      } catch (error) {
        setCanShip(false);
        setShippingFee(0);
        setDistance(null);
      }
    };
    fetchShippingFee();
  }, [customerInformation?.address, branchName, branchId, orderMode]);
  const orderDetails: { productId: number; quantity: number }[] =
    restaurant?._id && cart?.[restaurant._id]?.items
      ? Object.values(cart[restaurant._id].items).map((item) => ({
          productId: Number(item.data.productId) || 0,
          quantity: item.quantity,
        }))
      : [];

  useFocusEffect(
    useCallback(() => {
      const fetchCustomerInformation = async () => {
        if (!appState?.userInfo?.id) {
          return;
        }
        const res = await GetCustomerInformation(appState.userInfo.id);
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setAllAddresses(data);
        const defaultAddress =
          data.find((item: any) => item.isDefault === true) || data[0];
        setCustomerInformation(defaultAddress || null);
      };
      fetchCustomerInformation();
    }, [appState?.userInfo?.id])
  );

  const fetchAvailablePromotions = useCallback(async () => {
    try {
      setIsLoadingPromotions(true);
      const res = await GetAvailablePromotion();
      if (res.data && res.data.status === 0 && res.data.data) {
        setAvailablePromotions(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching available promotions:", error);
      setAvailablePromotions([]);
    } finally {
      setIsLoadingPromotions(false);
    }
  }, []);

  const handleCreateOrder = async () => {
    if (!appState?.userInfo?.id) {
      console.error("Customer ID không tồn tại");
      return;
    }
    if (!branchId) {
      console.error("Branch ID không tồn tại");
      return;
    }
    if (orderMode === "SHIPPING") {
      if (!customerInformation?.address) {
        console.error("Địa chỉ giao hàng không tồn tại");
        return;
      }
      if (!customerInformation?.phone) {
        console.error("Số điện thoại không tồn tại");
        return;
      }
    }
    if (!restaurant?._id || !cart?.[restaurant._id]?.items) {
      console.error("Giỏ hàng trống");
      return;
    }
    try {
      setLoading(true);
      const orderItemList = Object.values(cart[restaurant._id].items).map(
        (item: any) => {
          const isCombo = item?.data?.isCombo;
          const unitPrice = Number(
            item?.data?.basePrice || item?.data?.price || 0
          );
          return {
            productId: isCombo ? 0 : Number(item?.data?.productId) || 0,
            comboId: isCombo ? Number(item?.data?.comboId) || 0 : 0,
            quantity: item?.quantity || 0,
            price: unitPrice * (item?.quantity || 0),
            note: "",
          };
        }
      );
      const payload = {
        customerId: appState.userInfo.id,
        promotionCode: selectedPromotion?.id || "",
        discountValue: discountAmount,
        shippingAddress:
          orderMode === "SHIPPING"
            ? customerInformation.address
            : branchAddress || "",
        shippingPhoneNumber:
          orderMode === "SHIPPING"
            ? customerInformation.phone
            : appState?.userInfo?.phoneNumber || "",
        orderItemList,
        mode: orderMode === "SHIPPING" ? "SHIPPING" : "PICKUP",
        diningTableId: 0,
        branchId: branchId,
        paymentMethodId: 2,
        paymentMethod: "Thanh toán online",
        pointUsed: Number(pointsToUse) || 0,
      };
      const res = await CreateOrder(payload);
      console.log("CreateOrder response:", JSON.stringify(res.data, null, 2));

      const orderId = res.data?.data?.id;
      const orderStatus = res.data?.data?.orderStatus || res.data?.data?.status;

      let paymentUrl =
        res.data?.data?.paymentUrl ||
        res.data?.paymentUrl ||
        res.data?.data?.payment_url ||
        res.data?.payment_url;

      if (
        !paymentUrl &&
        orderId &&
        orderStatus === "CREATED" &&
        payload.paymentMethodId === 2
      ) {
        try {
          console.log(
            "PaymentUrl is null, fetching order details, orderId:",
            orderId
          );
          await new Promise((resolve) => setTimeout(resolve, 500));

          const orderRes = await GetOrderById(orderId);
          const orderData = orderRes.data?.data || orderRes.data;
          paymentUrl =
            orderData?.paymentUrl ||
            orderData?.payment_url ||
            orderData?.data?.paymentUrl;
          console.log("PaymentUrl from GetOrderById:", paymentUrl);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }

      if (
        paymentUrl &&
        typeof paymentUrl === "string" &&
        paymentUrl.trim() !== ""
      ) {
        console.log("Navigating to payment with URL:", paymentUrl);
        setTimeout(() => {
          router.push({
            pathname: "/(user)/order/payment.webview",
            params: { paymentUrl: paymentUrl },
          });
        }, 100);
      } else if (
        orderId &&
        orderStatus === "CREATED" &&
        payload.paymentMethodId === 2
      ) {
        console.log("No paymentUrl found, navigating to order details page");
        setTimeout(() => {
          router.push({
            pathname: "/(user)/order/[id]",
            params: { id: orderId.toString() },
          });
        }, 100);
      } else {
        console.log("No paymentUrl found, navigating to success page");
        setTimeout(() => {
          router.push("/(auth)/order.success");
        }, 100);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  const calculateDiscount = useCallback(
    (promotion: any, totalAmount: number, currentShippingFee: number) => {
      if (!promotion) return 0;

      const minOrderValue = promotion.minimumOrderValue || 0;
      if (totalAmount < minOrderValue) {
        return 0;
      }

      const promotionType = promotion.promotionTypeName || "";
      const value = promotion.value || 0;

      if (promotionType.includes("Giảm giá theo %")) {
        return Math.floor((totalAmount * value) / 100);
      } else if (promotionType.includes("Giảm giá cố định")) {
        return value;
      } else if (promotionType.includes("Miễn phí vận chuyển")) {
        return currentShippingFee;
      }

      return 0;
    },
    []
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
      }}
    >
      <HeaderHome pageName="placeOrderPage" />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 10 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.textContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "relative",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 15,
                color: APP_COLOR.BROWN,
                position: "relative",
                top: 5,
              }}
            >
              {orderMode === "SHIPPING" ? "Giao hàng" : "Nhận tại cửa hàng"}
            </Text>
          </View>

          <View
            style={{
              position: "relative",
              minWidth: 200,
              flex: 1,
            }}
          >
            {orderMode === "SHIPPING" && (
              <Pressable
                onPress={() => setShowAddressModal(true)}
                style={{ marginVertical: 10 }}
              >
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 14,
                      color: APP_COLOR.BROWN,
                    }}
                  >
                    {customerInformation?.fullName}
                  </Text>
                  <Text style={{ fontSize: 14, color: APP_COLOR.GRAY }}>|</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: APP_COLOR.BROWN,
                      fontFamily: FONTS.regular,
                    }}
                  >
                    {customerInformation?.phone}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  {customerInformation?.address}
                </Text>
              </Pressable>
            )}
            <View style={{ marginVertical: 10, flexDirection: "row", gap: 20 }}>
              <Pressable
                onPress={() => setOrderMode("SHIPPING")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor:
                      orderMode === "SHIPPING"
                        ? APP_COLOR.ORANGE
                        : APP_COLOR.GRAY,
                    backgroundColor:
                      orderMode === "SHIPPING"
                        ? APP_COLOR.ORANGE
                        : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {orderMode === "SHIPPING" && (
                    <AntDesign name="check" size={12} color={APP_COLOR.WHITE} />
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 14,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  Giao hàng
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOrderMode("PICKUP")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor:
                      orderMode === "PICKUP"
                        ? APP_COLOR.ORANGE
                        : APP_COLOR.GRAY,
                    backgroundColor:
                      orderMode === "PICKUP" ? APP_COLOR.ORANGE : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {orderMode === "PICKUP" && (
                    <AntDesign name="check" size={12} color={APP_COLOR.WHITE} />
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 14,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  Nhận tại cửa hàng
                </Text>
              </Pressable>
            </View>
            <View>
              <DropDown title="Cửa hàng tiếp nhận" value={branchName || ""} />
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              color: APP_COLOR.BROWN,
              marginBottom: 5,
            }}
          >
            Chi tiết đơn hàng
          </Text>
          {orderItems?.map((item, index) => {
            return (
              <View
                key={`${item.productId}-${index}`}
                style={{
                  gap: 10,
                  flexDirection: "row",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 14,
                      color: APP_COLOR.BROWN,
                    }}
                  >
                    {item.title} x {item.quantity}
                  </Text>

                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 14,
                      color: APP_COLOR.BROWN,
                    }}
                  >
                    {currencyFormatter(item.price)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <Formik
          validationSchema={ChangePasswordSchema}
          initialValues={{
            promotionCode: "",
            note: "",
            address: "",
            phoneNumber: "",
            branchId: 0,
            pointUsed: 0,
            pointEarned: 0,
            orderItems: [
              {
                productId: 0,
                quantity: 0,
              },
            ],
          }}
          onSubmit={() => {}}
        >
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            setFieldValue,
          }) => {
            useEffect(() => {
              if (customerInformation?.address || customerInformation?.phone) {
                setFieldValue("address", customerInformation?.address);
                setFieldValue("phoneNumber", customerInformation?.phone);
              }
              if (orderDetails) {
                setFieldValue("orderItems", orderDetails);
              }
              if (branchId) {
                setFieldValue("branchId", branchId);
              }
              if (restaurant && cart?.[restaurant._id]) {
                const totalAmount = cart[restaurant._id].sum;
                const earnedPoints = Math.floor(totalAmount / 1000);
                setFieldValue("pointEarned", earnedPoints);
                const currentPointUsed = Number(values.pointUsed) || 0;
                setFieldValue("pointUsed", currentPointUsed);
              }
            }, [
              customerInformation?.address,
              customerInformation?.phone,
              orderDetails,
              restaurant,
              cart,
              branchId,
            ]);
            useEffect(() => {
              if (selectedPromotion && restaurant?._id) {
                const totalAmount = calculateTotalPrice(cart, restaurant._id);
                const currentShippingFee =
                  selectedPromotion.promotionTypeName?.includes(
                    "Miễn phí vận chuyển"
                  )
                    ? 0
                    : originalShippingFee;
                const discount = calculateDiscount(
                  selectedPromotion,
                  totalAmount,
                  currentShippingFee
                );
                setDiscountAmount(discount);
                if (
                  selectedPromotion.promotionTypeName?.includes(
                    "Miễn phí vận chuyển"
                  )
                ) {
                  setShippingFee(0);
                } else {
                  setShippingFee(originalShippingFee);
                }
              } else {
                setDiscountAmount(0);
                setShippingFee(originalShippingFee);
              }
            }, [
              selectedPromotion,
              cart,
              restaurant,
              originalShippingFee,
              calculateDiscount,
            ]);
            useEffect(() => {
              const points = Number(pointsToUse) || 0;
              if (points > 0 && points <= pointUsed) {
                setPointDiscountAmount(points * 1000);
                setFieldValue("pointUsed", points);
              } else {
                setPointDiscountAmount(0);
                setFieldValue("pointUsed", 0);
              }
            }, [pointsToUse, pointUsed, setFieldValue]);

            return (
              <View style={styles.container}>
                {orderItems?.length > 0 && (
                  <View>
                    <View style={styles.textInputView}>
                      <Text style={styles.textInputText}>
                        Tổng tiền (
                        {restaurant &&
                          cart?.[restaurant._id] &&
                          cart?.[restaurant._id].quantity}{" "}
                        món)
                      </Text>
                      <Pressable
                        onPress={async () => {
                          await fetchAvailablePromotions();
                          setShowPromotionModal(true);
                        }}
                      >
                        <Text
                          style={{
                            color: APP_COLOR.ORANGE,
                            fontFamily: FONTS.regular,
                            fontSize: 14,
                            textDecorationLine: "underline",
                            marginVertical: "auto",
                          }}
                        >
                          {selectedPromotion ? (
                            <Text
                              style={{
                                textDecorationLine: "none",
                                fontSize: 14,
                              }}
                            >
                              Đã áp dụng
                            </Text>
                          ) : (
                            "Mã khuyến mãi"
                          )}
                        </Text>
                      </Pressable>
                    </View>
                    <View style={styles.textInputView}>
                      <Text
                        style={[
                          styles.textInputText,
                          { fontFamily: FONTS.regular, fontSize: 14 },
                        ]}
                      >
                        Thành tiền
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.regular,
                          fontSize: 14,
                          color: APP_COLOR.BROWN,
                        }}
                      >
                        {currencyFormatter(
                          calculateTotalPrice(cart, restaurant?._id) || 0
                        )}
                      </Text>
                    </View>
                    {orderMode === "SHIPPING" && (
                      <View style={styles.textInputView}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Text
                            style={[
                              styles.textInputText,
                              { fontFamily: FONTS.regular, fontSize: 14 },
                            ]}
                          >
                            Phí giao hàng
                          </Text>
                          {distance !== null && (
                            <Text
                              style={{
                                fontFamily: FONTS.regular,
                                fontSize: 12,
                                color: APP_COLOR.BROWN,
                              }}
                            >
                              ({distance.toFixed(1)} km)
                            </Text>
                          )}
                        </View>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 14,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          {currencyFormatter(shippingFee)}
                        </Text>
                      </View>
                    )}
                    {selectedPromotion && discountAmount > 0 && (
                      <View style={styles.textInputView}>
                        <Text
                          style={[
                            styles.textInputText,
                            { fontFamily: FONTS.regular, fontSize: 14 },
                          ]}
                        >
                          Phí giảm sau khi áp mã
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 14,
                            color: APP_COLOR.ORANGE,
                          }}
                        >
                          -{currencyFormatter(discountAmount)}
                        </Text>
                      </View>
                    )}
                    {pointUsed > 0 && (
                      <View style={styles.textInputView}>
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                styles.textInputText,
                                {
                                  fontFamily: FONTS.regular,
                                  fontSize: 14,
                                },
                              ]}
                            >
                              Sử dụng điểm thưởng
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <TextInput
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomColor: APP_COLOR.BROWN,
                                  paddingBottom: 1,
                                  width: 35,
                                  textAlign: "center",
                                  fontFamily: FONTS.regular,
                                  fontSize: 14,
                                  color: APP_COLOR.BROWN,
                                }}
                                value={pointsToUse}
                                onChangeText={(text) => {
                                  const numericValue = text.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  const numValue = Number(numericValue);
                                  if (numericValue === "" || numValue === 0) {
                                    setPointsToUse("");
                                  } else if (numValue > pointUsed) {
                                    setPointsToUse(pointUsed.toString());
                                  } else {
                                    setPointsToUse(numericValue);
                                  }
                                }}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={APP_COLOR.BROWN}
                              />
                              <Text
                                style={{
                                  fontFamily: FONTS.regular,
                                  fontSize: 12,
                                  color: APP_COLOR.BROWN,
                                }}
                              >
                                điểm
                              </Text>
                            </View>
                          </View>
                          <Text
                            style={{
                              fontFamily: FONTS.regular,
                              fontSize: 11,
                              color: APP_COLOR.BROWN,
                              marginTop: 4,
                            }}
                          >
                            Bạn có {pointUsed} điểm (1 điểm = 1.000đ)
                          </Text>
                        </View>
                      </View>
                    )}
                    {pointDiscountAmount > 0 && (
                      <View style={styles.textInputView}>
                        <Text
                          style={[
                            styles.textInputText,
                            { fontFamily: FONTS.regular, fontSize: 14 },
                          ]}
                        >
                          Giảm từ điểm thưởng
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 14,
                            color: APP_COLOR.ORANGE,
                          }}
                        >
                          -{currencyFormatter(pointDiscountAmount)}
                        </Text>
                      </View>
                    )}{" "}
                    {canShip && (
                      <Text
                        style={{
                          fontFamily: FONTS.regular,
                          fontSize: 12,
                          color: APP_COLOR.CANCEL,
                          marginBottom: 5,
                          fontStyle: "italic",
                        }}
                      >
                        * Chỉ hỗ trợ giao hàng tại TP.HCM và không quá 5km
                      </Text>
                    )}
                    <CustomerInforInput
                      onChangeText={handleChange("note")}
                      onBlur={handleBlur("note")}
                      value={values.note}
                      error={errors.note}
                      touched={touched.note}
                      placeholder="Ghi chú"
                      placeholderTextColor={APP_COLOR.ORANGE}
                    />
                    <View style={styles.textInputView}>
                      <Text
                        style={[
                          styles.textInputText,
                          { fontFamily: FONTS.bold, fontSize: 18 },
                        ]}
                      >
                        Số tiền thanh toán
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.bold,
                          fontSize: 18,
                          color: APP_COLOR.BROWN,
                        }}
                      >
                        {currencyFormatter(
                          Math.max(
                            0,
                            calculateTotalPrice(cart, restaurant?._id) +
                              shippingFee -
                              discountAmount -
                              pointDiscountAmount
                          )
                        )}
                      </Text>
                    </View>
                  </View>
                )}
                {selectedPromotion && (
                  <View
                    style={{
                      marginHorizontal: 5,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: APP_COLOR.ORANGE,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 15,
                            color: APP_COLOR.BROWN,
                            marginBottom: 1,
                          }}
                        >
                          {selectedPromotion.name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 12,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          {selectedPromotion.description}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setSelectedPromotion(null);
                          setFieldValue("promotionCode", "");
                          setDiscountAmount(0);
                          setShippingFee(originalShippingFee);
                        }}
                        style={{
                          padding: 5,
                        }}
                      >
                        <AntDesign
                          name="close-circle"
                          size={20}
                          color={APP_COLOR.CANCEL}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
                <Modal
                  visible={showPromotionModal}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setShowPromotionModal(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: APP_COLOR.WHITE,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        maxHeight: "70%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 18,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          Chọn mã khuyến mãi
                        </Text>
                        <Pressable
                          onPress={() => {
                            setShowPromotionModal(false);
                          }}
                        >
                          <AntDesign
                            name="close"
                            size={24}
                            color={APP_COLOR.BROWN}
                          />
                        </Pressable>
                      </View>
                      {isLoadingPromotions ? (
                        <View
                          style={{
                            paddingVertical: 40,
                            alignItems: "center",
                          }}
                        >
                          <ActivityIndicator
                            size="large"
                            color={APP_COLOR.ORANGE}
                          />
                        </View>
                      ) : availablePromotions.length === 0 ? (
                        <View
                          style={{
                            paddingVertical: 40,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.regular,
                              fontSize: 14,
                              color: APP_COLOR.BROWN,
                            }}
                          >
                            Không có mã khuyến mãi khả dụng
                          </Text>
                        </View>
                      ) : (
                        <FlatList
                          data={availablePromotions}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => {
                            const totalAmount = calculateTotalPrice(
                              cart,
                              restaurant?._id
                            );
                            const isDisabled =
                              totalAmount < (item.minimumOrderValue || 0);
                            const discount = calculateDiscount(
                              item,
                              totalAmount,
                              shippingFee
                            );

                            return (
                              <Pressable
                                onPress={() => {
                                  if (isDisabled) return;
                                  const previousPromotion = selectedPromotion;
                                  setSelectedPromotion(item);
                                  setFieldValue("promotionCode", item.id);
                                  setShowPromotionModal(false);
                                }}
                                style={{
                                  backgroundColor:
                                    selectedPromotion?.id === item.id
                                      ? APP_COLOR.BACKGROUND_ORANGE
                                      : APP_COLOR.WHITE,
                                  padding: 15,
                                  marginBottom: 10,
                                  borderRadius: 10,
                                  borderWidth: 2,
                                  borderColor:
                                    selectedPromotion?.id === item.id
                                      ? APP_COLOR.ORANGE
                                      : APP_COLOR.BROWN,
                                  opacity: isDisabled ? 0.5 : 1,
                                }}
                                disabled={isDisabled}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <View style={{ flex: 1 }}>
                                    <Text
                                      style={{
                                        fontFamily: FONTS.bold,
                                        fontSize: 15,
                                        color: APP_COLOR.BROWN,
                                        marginBottom: 5,
                                      }}
                                    >
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: FONTS.regular,
                                        fontSize: 12,
                                        color: APP_COLOR.BROWN,
                                        marginBottom: 5,
                                      }}
                                    >
                                      {item.description}
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: FONTS.medium,
                                        fontSize: 11,
                                        color: APP_COLOR.ORANGE,
                                        marginBottom: 3,
                                      }}
                                    >
                                      {item.promotionTypeName}
                                    </Text>
                                    {item.promotionTypeName?.includes(
                                      "Giảm giá theo %"
                                    ) ? (
                                      <Text
                                        style={{
                                          fontFamily: FONTS.regular,
                                          fontSize: 12,
                                          color: APP_COLOR.BROWN,
                                        }}
                                      >
                                        Giảm: {item.value}%
                                      </Text>
                                    ) : item.promotionTypeName?.includes(
                                        "Giảm giá cố định"
                                      ) ? (
                                      <Text
                                        style={{
                                          fontFamily: FONTS.regular,
                                          fontSize: 12,
                                          color: APP_COLOR.BROWN,
                                        }}
                                      >
                                        Giảm:{" "}
                                        {currencyFormatter(item.value || 0)}
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          fontFamily: FONTS.regular,
                                          fontSize: 12,
                                          color: APP_COLOR.BROWN,
                                        }}
                                      >
                                        Miễn phí vận chuyển
                                      </Text>
                                    )}
                                    {item.minimumOrderValue > 0 && (
                                      <Text
                                        style={{
                                          fontFamily: FONTS.regular,
                                          fontSize: 11,
                                          color: APP_COLOR.GRAY,
                                          marginTop: 3,
                                        }}
                                      >
                                        Đơn tối thiểu:{" "}
                                        {currencyFormatter(
                                          item.minimumOrderValue
                                        )}
                                      </Text>
                                    )}
                                    {isDisabled && (
                                      <Text
                                        style={{
                                          fontFamily: FONTS.regular,
                                          fontSize: 11,
                                          color: APP_COLOR.CANCEL,
                                          marginTop: 3,
                                        }}
                                      >
                                        Đơn hàng chưa đủ điều kiện
                                      </Text>
                                    )}
                                  </View>
                                  {selectedPromotion?.id === item.id && (
                                    <AntDesign
                                      name="check-circle"
                                      size={24}
                                      color={APP_COLOR.ORANGE}
                                    />
                                  )}
                                </View>
                                {discount > 0 && !isDisabled && (
                                  <View
                                    style={{
                                      marginTop: 10,
                                      paddingTop: 10,
                                      borderTopWidth: 1,
                                      borderTopColor: APP_COLOR.BROWN,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily: FONTS.bold,
                                        fontSize: 13,
                                        color: APP_COLOR.ORANGE,
                                      }}
                                    >
                                      Giảm được: {currencyFormatter(discount)}
                                    </Text>
                                  </View>
                                )}
                              </Pressable>
                            );
                          }}
                        />
                      )}
                    </View>
                  </View>
                </Modal>
                <Modal
                  visible={showAddressModal}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setShowAddressModal(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: APP_COLOR.WHITE,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        maxHeight: "80%",
                        flex: 1,
                        paddingBottom: 50,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 20,
                          borderBottomWidth: 1,
                          borderBottomColor: APP_COLOR.BACKGROUND_ORANGE,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.semiBold,
                            fontSize: 18,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          Chọn địa chỉ giao hàng
                        </Text>
                        <Pressable onPress={() => setShowAddressModal(false)}>
                          <AntDesign
                            name="close"
                            size={24}
                            color={APP_COLOR.BROWN}
                          />
                        </Pressable>
                      </View>
                      <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                      >
                        {allAddresses.length === 0 ? (
                          <View
                            style={{
                              padding: 20,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: FONTS.regular,
                                fontSize: 14,
                                color: APP_COLOR.BROWN,
                                textAlign: "center",
                              }}
                            >
                              Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                            </Text>
                            <Pressable
                              onPress={() => {
                                setShowAddressModal(false);
                                router.navigate("/(user)/order/address.create");
                              }}
                              style={{
                                marginTop: 15,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: APP_COLOR.ORANGE,
                                borderRadius: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: FONTS.semiBold,
                                  fontSize: 14,
                                  color: APP_COLOR.WHITE,
                                }}
                              >
                                Thêm địa chỉ mới
                              </Text>
                            </Pressable>
                          </View>
                        ) : (
                          allAddresses.map((address: any, index: number) => (
                            <Pressable
                              key={address.informationId || `address-${index}`}
                              onPress={() => {
                                setCustomerInformation(address);
                                setShowAddressModal(false);
                              }}
                              style={{
                                padding: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: APP_COLOR.BACKGROUND_ORANGE,
                                backgroundColor:
                                  customerInformation?.informationId ===
                                  address.informationId
                                    ? APP_COLOR.BACKGROUND_ORANGE
                                    : "transparent",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <View style={{ flex: 1 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      gap: 5,
                                      alignItems: "center",
                                      marginBottom: 5,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily: FONTS.semiBold,
                                        fontSize: 14,
                                        color: APP_COLOR.BROWN,
                                      }}
                                    >
                                      {address.fullName}
                                    </Text>
                                    {address.isDefault && (
                                      <View
                                        style={{
                                          backgroundColor: APP_COLOR.ORANGE,
                                          paddingHorizontal: 8,
                                          paddingVertical: 2,
                                          borderRadius: 4,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontFamily: FONTS.regular,
                                            fontSize: 12,
                                            color: APP_COLOR.WHITE,
                                          }}
                                        >
                                          Mặc định
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <Text
                                    style={{
                                      fontFamily: FONTS.regular,
                                      fontSize: 14,
                                      color: APP_COLOR.BROWN,
                                      marginBottom: 3,
                                    }}
                                  >
                                    {address.phone}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: FONTS.regular,
                                      fontSize: 14,
                                      color: APP_COLOR.BROWN,
                                    }}
                                  >
                                    {address.address}
                                  </Text>
                                </View>
                                {customerInformation?.informationId ===
                                  address.informationId && (
                                  <FontAwesome5
                                    name="check-circle"
                                    size={24}
                                    color={APP_COLOR.ORANGE}
                                  />
                                )}
                              </View>
                            </Pressable>
                          ))
                        )}
                      </ScrollView>
                      <View
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 15,
                          borderTopWidth: 1,
                          borderTopColor: APP_COLOR.BACKGROUND_ORANGE,
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            setShowAddressModal(false);
                            router.navigate("/(user)/order/address.create");
                          }}
                          style={{
                            paddingVertical: 12,
                            backgroundColor: APP_COLOR.ORANGE,
                            borderRadius: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.semiBold,
                              fontSize: 14,
                              color: APP_COLOR.WHITE,
                            }}
                          >
                            + Thêm địa chỉ mới
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
      <ShareButton
        loading={loading}
        title="Đặt hàng"
        onPress={handleCreateOrder}
        textStyle={{
          textTransform: "uppercase",
          color: APP_COLOR.WHITE,
          paddingVertical: 5,
          fontFamily: FONTS.regular,
          fontSize: 16,
          alignItems: "center",
        }}
        btnStyle={{
          position: "absolute",
          bottom: 50,
          height: 55,
          width: "80%",
          alignSelf: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: APP_COLOR.ORANGE,
          paddingHorizontal: 10,
        }}
        pressStyle={{ alignSelf: "stretch" }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 3,
    backgroundColor: APP_COLOR.WHITE,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  textContainer: {
    backgroundColor: APP_COLOR.WHITE,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  textInputView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInputText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.bold,
    fontSize: 15,
    marginVertical: "auto",
  },
});
export default PlaceOrderPage;
