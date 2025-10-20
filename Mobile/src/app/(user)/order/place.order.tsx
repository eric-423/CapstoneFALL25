import { useCurrentApp } from "@/context/app.context";
import { FONTS } from "@/theme/typography";
import { currencyFormatter } from "@/utils/cart";
import { calculateTotalPrice } from "@/utils/cart";
import { APP_COLOR } from "@/utils/constant";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
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

interface IOrderItem {
  title: string;
  option: string;
  price: number;
  quantity: number;
  productId: number;
}

const sampleOrderItems: IOrderItem[] = [
  {
    title: "Pizza Margherita",
    option: "Size L",
    price: 250000,
    quantity: 2,
    productId: 1,
  },
  {
    title: "Spaghetti Carbonara",
    option: "Thêm phô mai",
    price: 180000,
    quantity: 1,
    productId: 2,
  },
  {
    title: "Caesar Salad",
    option: "",
    price: 120000,
    quantity: 1,
    productId: 3,
  },
  {
    title: "Coca Cola",
    option: "Size M",
    price: 25000,
    quantity: 3,
    productId: 4,
  },
];

const PlaceOrderPage = () => {
  const { restaurant, cart } = useCurrentApp();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>(sampleOrderItems);
  const [decodeToken, setDecodeToken] = useState<any>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cusAddress, setCusAddress] = useState("123 Đường ABC, Quận 1, TP.HCM");
  const [cusPhone, setCusPhone] = useState("0901234567");
  const { branchId } = useCurrentApp();
  const [selectedOption, setSelectedOption] = useState<string | null>("1");
  const [shippingFee, setShippingFee] = useState<number>(15000);
  const dropdownItems = [
    { id: "1", title: "COD" },
    { id: "4", title: "PAYOS" },
  ];
  const [addresses, setAddresses] = useState<string[]>([
    "123 Đường ABC, Quận 1, TP.HCM",
    "456 Đường XYZ, Quận 2, TP.HCM",
    "789 Đường DEF, Quận 3, TP.HCM",
  ]);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    "123 Đường ABC, Quận 1, TP.HCM"
  );
  const [orderDetails, setOrderDetails] = useState<
    { productId: number; quantity: number }[]
  >([
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
    { productId: 3, quantity: 1 },
    { productId: 4, quantity: 3 },
  ]);
  const [couponStatus, setCouponStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [availablePromotions, setAvailablePromotions] = useState<any[]>([]);
  const [showPromotions, setShowPromotions] = useState(false);

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
            Giao hàng
          </Text>
          <AntDesign name="edit" size={24} color={APP_COLOR.BROWN} />
        </View>
        <View
          style={{
            position: "relative",
            minWidth: 200,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 15,
              color: APP_COLOR.BROWN,
              marginTop: 5,
            }}
          >
            85 Cô Giang, Q1, TP.HCM
          </Text>
          <View style={{ marginHorizontal: 10 }}>
            <TextInput
              placeholder="Tên người nhận"
              value={searchTerm}
              onFocus={() => setShowSuggestions(true)}
              onChangeText={(text) => {
                setSearchTerm(text);
                setShowSuggestions(true);
              }}
              style={styles.textInput}
              placeholderTextColor={APP_COLOR.BROWN}
            />
            <TextInput
              placeholder="Số điện thoại"
              value={searchTerm}
              onFocus={() => setShowSuggestions(true)}
              onChangeText={(text) => {
                setSearchTerm(text);
                setShowSuggestions(true);
              }}
              style={styles.textInput}
              placeholderTextColor={APP_COLOR.BROWN}
            />
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 12,
                color: APP_COLOR.BROWN,
                marginBottom: 5,
                fontStyle: "italic",
              }}
            >
              * Chỉ hỗ trợ giao hàng tại TP.HCM
            </Text>
          </View>
          <View
            style={{
              marginVertical: 15,
              borderBottomWidth: 0.5,
              borderBottomColor: APP_COLOR.BROWN,
              paddingBottom: 10,
            }}
          >
            <DropDown title="Cửa hàng tiếp nhận" value="Tấm Tắc Cô Giang" />
            <DropDown title="Thời gian giao" value="9:00 am" />
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
            paymentMethodId: 0,
            orderItems: [
              {
                productId: 0,
                quantity: 0,
              },
            ],
            pickUp: false,
            proxyName: "",
            proxyPhone: "",
          }}
          onSubmit={() => {}}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => {
            useEffect(() => {
              if (cusAddress || cusPhone) {
                setFieldValue("address", cusAddress);
                setFieldValue("phoneNumber", cusPhone);
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
              cusAddress,
              cusPhone,
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
                      `https://wdp301-su25.space/api/promotions/code/${values.promotionCode}`,
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
                <View style={styles.dropdownContainer}>
                  <Text style={[styles.textInputText]}>
                    Phương thức thanh toán
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "space-around",
                    }}
                  >
                    {dropdownItems.map((item, index) => (
                      <View
                        key={`${item.id}-${index}`}
                        style={styles.dropdownItemContainer}
                      >
                        <Pressable
                          style={[
                            styles.checkbox,
                            selectedOption === item.id &&
                              styles.selectedCheckbox,
                          ]}
                          onPress={() => {
                            setSelectedOption(item.id);
                            setFieldValue("paymentMethodId", parseInt(item.id));
                          }}
                        >
                          {selectedOption === item.id && (
                            <AntDesign
                              name="check"
                              size={16}
                              color={APP_COLOR.WHITE}
                            />
                          )}
                        </Pressable>
                        <Text
                          style={[
                            styles.dropdownText,
                            selectedOption === item.id &&
                              styles.selectedDropdownText,
                          ]}
                        >
                          {item.title}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {errors.paymentMethodId && touched.paymentMethodId && (
                    <Text style={styles.errorText}>
                      {errors.paymentMethodId}
                    </Text>
                  )}
                </View>
                <CustomerInforInput
                  title="Đặt hàng hộ"
                  value={values.pickUp}
                  setValue={(v) => setFieldValue("pickUp", v)}
                  isBoolean={true}
                />
                {values.pickUp && (
                  <View style={{ marginBottom: 10 }}>
                    <CustomerInforInput
                      title="Tên người nhận hộ"
                      onChangeText={handleChange("proxyName")}
                      onBlur={handleBlur("proxyName ")}
                      value={values.proxyName}
                      error={errors.proxyName}
                      touched={touched.proxyName}
                      placeholder="Nhập tên người nhận hộ"
                    />
                    <CustomerInforInput
                      title="Số điện thoại người nhận hộ"
                      onChangeText={handleChange("proxyPhone")}
                      onBlur={handleBlur("proxyPhone")}
                      value={values.proxyPhone}
                      error={errors.proxyPhone}
                      touched={touched.proxyPhone}
                      placeholder="Nhập số điện thoại người nhận hộ"
                      keyboardType="phone-pad"
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
                />
                <ShareButton
                  loading={loading}
                  title="Tạo đơn hàng"
                  onPress={() => {}}
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
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              Địa chỉ giao hàng
            </Text>
            <ScrollView>
              {addresses.map((address: string, index: number) => (
                <Pressable
                  key={`${address}-${index}`}
                  onPress={() => {}}
                  style={styles.addressItem}
                >
                  <View>
                    <Text style={styles.textNameInfor}>{address}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
    borderRadius: 10,
    paddingVertical: 10,
    color: APP_COLOR.BROWN,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    marginVertical: 10,
    minWidth: 200,
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  textNameInfor: {
    fontFamily: FONTS.regular,
    fontSize: 17,
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
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownLabel: {
    fontFamily: FONTS.regular,
    fontSize: 17,
    marginBottom: 8,
    color: APP_COLOR.BROWN,
  },
  dropdown: {
    gap: 9,
  },
  dropdownItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: APP_COLOR.BROWN,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCheckbox: {
    backgroundColor: APP_COLOR.BROWN,
  },
  dropdownItem: {
    flex: 1,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
  },
  selectedDropdownItem: {
    backgroundColor: APP_COLOR.BROWN,
  },
  dropdownText: {
    fontFamily: FONTS.regular,
    fontSize: 17,
    color: APP_COLOR.BROWN,
  },
  selectedDropdownText: {
    color: APP_COLOR.ORANGE,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
export default PlaceOrderPage;
