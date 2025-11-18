import { useCurrentApp } from "@/context/app.context";
import { FONTS } from "@/theme/typography";
import { currencyFormatter } from "@/utils/cart";
import { calculateTotalPrice } from "@/utils/cart";
import { APP_COLOR, BASE_URL } from "@/utils/constant";
import { useEffect, useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Formik } from "formik";
import { ChangePasswordSchema } from "@/utils/validate.schema";
import CustomerInforInput from "@/components/input/customerInfo.input";
import ShareButton from "@/components/button/share.button";
import HeaderHome from "@/components/home/header.home";
import { AntDesign } from "@expo/vector-icons";
import DropDown from "@/components/order/item.dropdown";
import { router, useFocusEffect } from "expo-router";
import {
  GetCustomerInformation,
  GetShippingFee,
  CreateOrder,
  GetBranchInfo,
} from "@/utils/api";

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
  const [couponStatus, setCouponStatus] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [availablePromotions, setAvailablePromotions] = useState<any[]>([]);
  const [showPromotions, setShowPromotions] = useState(false);
  const [customerInformation, setCustomerInformation] = useState<any>(null);
  const [canShip, setCanShip] = useState(false);
  const [orderMode, setOrderMode] = useState<"SHIPPING" | "PICKUP">("SHIPPING");
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
        return;
      }
      if (!customerInformation?.address || !branchAddress) {
        return;
      }
      try {
        const res = await GetShippingFee(
          customerInformation.address,
          branchAddress
        );
        setShippingFee(res.data.data);
      } catch (error) {
        setCanShip(false);
        setShippingFee(0);
      }
    };
    fetchShippingFee();
  }, [customerInformation?.address, branchName, orderMode]);
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
        const filteredData = Array.isArray(res.data.data)
          ? res.data.data.filter((item: any) => item.isDefault === true)
          : res.data.data;
        setCustomerInformation(filteredData[0] || null);
      };
      fetchCustomerInformation();
    }, [appState?.userInfo?.id])
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
      }}
    >
      <HeaderHome pageName="placeOrderPage" />
      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
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
              fontSize: 17,
              color: APP_COLOR.BROWN,
              position: "relative",
              top: 5,
            }}
          >
            {orderMode === "SHIPPING" ? "Giao hàng" : "Tự lấy"}
          </Text>
          {orderMode === "SHIPPING" && (
            <Pressable
              style={{ marginRight: 10 }}
              onPress={() => router.navigate("/(user)/order/address.create")}
            >
              <AntDesign name="edit" size={25} color={APP_COLOR.BROWN} />
            </Pressable>
          )}
        </View>

        <View
          style={{
            position: "relative",
            minWidth: 200,
            flex: 1,
          }}
        >
          {orderMode === "SHIPPING" && (
            <View style={{ marginVertical: 10 }}>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 18,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  {customerInformation?.fullName}
                </Text>
                <Text style={{ fontSize: 18, color: APP_COLOR.GRAY }}>|</Text>
                <Text
                  style={{
                    fontSize: 18,
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
                  fontSize: 16,
                  color: APP_COLOR.BROWN,
                }}
              >
                {customerInformation?.address}
              </Text>
            </View>
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
                    orderMode === "SHIPPING" ? APP_COLOR.ORANGE : "transparent",
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
                  fontSize: 16,
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
                    orderMode === "PICKUP" ? APP_COLOR.ORANGE : APP_COLOR.GRAY,
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
                  fontSize: 16,
                  color: APP_COLOR.BROWN,
                }}
              >
                Tự lấy
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              marginVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: APP_COLOR.BROWN,
              paddingBottom: 10,
            }}
          >
            <DropDown title="Cửa hàng tiếp nhận" value={branchName || ""} />
          </View>
        </View>

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 20,
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
                    fontSize: 17,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  {item.title} x {item.quantity}
                </Text>

                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 17,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  {currencyFormatter(item.price)}
                </Text>
              </View>
            </View>
          );
        })}

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
              const fetchPromotion = async () => {
                if (values.promotionCode) {
                  try {
                    const token = await AsyncStorage.getItem("access_token");
                    const res = await axios.get(
                      `${BASE_URL}/promotions/code/${values.promotionCode}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          accept: "*/*",
                        },
                      }
                    );
                    if (res.data && res.data.discountAmount) {
                      setDiscountAmount(res.data.discountAmount);
                    } else {
                      setDiscountAmount(0);
                    }
                  } catch (e) {
                    setDiscountAmount(0);
                  }
                } else {
                  setDiscountAmount(0);
                }
              };
              fetchPromotion();
            }, [values.promotionCode]);
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
                const orderItemList = Object.values(
                  cart[restaurant._id].items
                ).map((item: any) => {
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
                });
                const payload = {
                  customerId: appState.userInfo.id,
                  promotionCode: values.promotionCode || "",
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
                };
                const res = await CreateOrder(payload);
                if (res.data?.data?.paymentUrl) {
                  router.replace({
                    pathname: "/(user)/order/payment.webview",
                    params: { paymentUrl: res.data.data.paymentUrl },
                  });
                } else {
                  router.replace("/(auth)/order.success");
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

            return (
              <View style={styles.container}>
                {orderItems?.length > 0 && (
                  <View
                    style={{
                      marginVertical: 15,
                      borderTopWidth: 0.5,
                      borderTopColor: APP_COLOR.BROWN,
                      paddingTop: 10,
                    }}
                  >
                    <View style={styles.textInputView}>
                      <Text style={styles.textInputText}>
                        Tổng tiền (
                        {restaurant &&
                          cart?.[restaurant._id] &&
                          cart?.[restaurant._id].quantity}{" "}
                        món)
                      </Text>
                      <Pressable
                        onPress={() => {
                          if (couponStatus === true) {
                            setCouponStatus(false);
                            setShowPromotions(false);
                          } else {
                            setCouponStatus(true);
                            setShowPromotions(true);
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: APP_COLOR.ORANGE,
                            fontFamily: FONTS.regular,
                            textDecorationLine: "underline",
                            marginVertical: "auto",
                          }}
                        >
                          {values.promotionCode ? (
                            <Text
                              style={{
                                textDecorationLine: "none",
                                fontSize: 18,
                              }}
                            >
                              {values.promotionCode}
                            </Text>
                          ) : (
                            "Áp dụng mã khuyến mãi"
                          )}
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.textInputView}>
                      <Text
                        style={[
                          styles.textInputText,
                          { fontFamily: FONTS.regular, fontSize: 17 },
                        ]}
                      >
                        Thành tiền
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.regular,
                          fontSize: 17,
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
                        <Text
                          style={[
                            styles.textInputText,
                            { fontFamily: FONTS.regular, fontSize: 17 },
                          ]}
                        >
                          Phí giao hàng
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 17,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          {currencyFormatter(shippingFee)}
                        </Text>
                      </View>
                    )}
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
                    <View style={styles.textInputView}>
                      <Text
                        style={[
                          styles.textInputText,
                          { fontFamily: FONTS.regular, fontSize: 17 },
                        ]}
                      >
                        Mã Giảm giá
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.regular,
                          fontSize: 17,
                          color: APP_COLOR.BROWN,
                        }}
                      >
                        {currencyFormatter(discountAmount)}
                      </Text>
                    </View>
                    <View style={styles.textInputView}>
                      <Text
                        style={[
                          styles.textInputText,
                          { fontFamily: FONTS.bold, fontSize: 20 },
                        ]}
                      >
                        Số tiền thanh toán
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.bold,
                          fontSize: 20,
                          color: APP_COLOR.BROWN,
                        }}
                      >
                        {currencyFormatter(
                          calculateTotalPrice(cart, restaurant?._id) +
                            shippingFee -
                            discountAmount || 0
                        )}
                      </Text>
                    </View>
                  </View>
                )}
                {couponStatus && (
                  <CustomerInforInput
                    onChangeText={handleChange("promotionCode")}
                    onBlur={handleBlur("promotionCode")}
                    value={values.promotionCode}
                    error={errors.promotionCode}
                    touched={touched.promotionCode}
                    placeholder="Nhập mã khuyến mãi"
                  />
                )}
                {showPromotions && availablePromotions.length > 0 && (
                  <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 16,
                        color: APP_COLOR.BROWN,
                        marginBottom: 10,
                      }}
                    >
                      Mã khuyến mãi khả dụng:
                    </Text>
                    <FlatList
                      data={availablePromotions}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.promotionId.toString()}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => {
                            setFieldValue("promotionCode", item.code);
                            setShowPromotions(false);
                            setCouponStatus(false);
                          }}
                          style={{
                            backgroundColor: APP_COLOR.WHITE,
                            padding: 12,
                            marginRight: 10,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: APP_COLOR.BROWN,
                            width: 150,
                            minHeight: 80,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.bold,
                              fontSize: 14,
                              color: APP_COLOR.BROWN,
                              marginBottom: 4,
                            }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONTS.regular,
                              fontSize: 12,
                              color: APP_COLOR.BROWN,
                              marginBottom: 4,
                            }}
                          >
                            {item.description}
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONTS.medium,
                              fontSize: 12,
                              color: APP_COLOR.ORANGE,
                            }}
                          >
                            Giảm: {item.discountAmount?.toLocaleString()}đ
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONTS.regular,
                              fontSize: 10,
                              color: APP_COLOR.GRAY,
                            }}
                          >
                            HSD:{" "}
                            {item.endDate
                              ? new Date(item.endDate).toLocaleDateString()
                              : ""}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </View>
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
                <ShareButton
                  loading={loading}
                  title="Tạo đơn hàng"
                  onPress={handleCreateOrder}
                  textStyle={{
                    textTransform: "uppercase",
                    color: APP_COLOR.WHITE,
                    paddingVertical: 5,
                    fontFamily: FONTS.regular,
                    fontSize: 18,
                  }}
                  btnStyle={{
                    justifyContent: "center",
                    borderRadius: 10,
                    paddingVertical: 5,
                    backgroundColor: APP_COLOR.ORANGE,
                    width: "80%",
                    alignSelf: "center",
                    marginTop: 5,
                  }}
                  pressStyle={{ alignSelf: "stretch" }}
                />
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 3,
  },
  textInputView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInputText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginVertical: "auto",
  },
});
export default PlaceOrderPage;
