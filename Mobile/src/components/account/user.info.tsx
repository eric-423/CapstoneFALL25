import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_COLOR, GOOGLE_API_KEY } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import logo from "@/assets/logo.png";
import { useFocusEffect } from "expo-router";
import Toast from "react-native-root-toast";
import footerFrame from "@/assets/frame_footer.png";
import { AddNewCustomerInformation, GetCustomerInformation } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import ItemAddress from "../order/item.address";
import { Ionicons } from "@expo/vector-icons";
import CheckBox from "react-native-check-box";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import debounce from "debounce";

interface DecodedToken {
  id?: number;
  fullName: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
}

const UserInfo = () => {
  const [decodeToken, setDecodeToken] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [customerInformation, setCustomerInformation] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    isDefault: false,
  });
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const addressInputRef = useRef<TextInput>(null);
  const { appState } = useCurrentApp();
  const getAccessToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      setToken(token);
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodeToken(decoded);
      } else {
        Toast.show("No access token found. Please log in.", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
      }
    } catch (error) {
      console.error("Error retrieving access token:", error);
      Toast.show("Failed to load user information.", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleAddAddress = async () => {
    try {
      await AddNewCustomerInformation(appState?.userInfo?.id || 0, {
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phone,
        isDefault: formData.isDefault,
      });
      await fetchCustomerInformation();
      setFormData({
        name: "",
        phone: "",
        address: "",
        isDefault: false,
      });
      setAddressSuggestions([]);
      setShowSuggestions(false);
      setModalVisible(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error adding customer information:", error);
    }
  };
  const fetchAddressSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 3) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        setIsLoadingSuggestions(true);
        const location = "10.8231,106.6297";
        const radius = 50000;
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/place/autocomplete/json",
          {
            params: {
              input,
              key: GOOGLE_API_KEY,
              language: "vi",
              location,
              radius,
              components: "country:vn",
            },
          }
        );
        if (response.data.predictions && response.data.predictions.length > 0) {
          setAddressSuggestions(response.data.predictions);
          setShowSuggestions(true);
        } else {
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setAddressSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300),
    []
  );

  const updateAddressField = useCallback(
    (address: string, shouldFetchSuggestions: boolean = true) => {
      setFormData((prev) => ({ ...prev, address }));
      if (shouldFetchSuggestions) {
        fetchAddressSuggestions(address);
      }
    },
    [fetchAddressSuggestions]
  );

  const handleAddressChange = (text: string) => {
    updateAddressField(text, true);
  };

  const handleSelectSuggestion = async (
    placeId: string,
    description: string
  ) => {
    addressInputRef.current?.setNativeProps({ text: description });
    updateAddressField(description, false);
    setShowSuggestions(false);
    setAddressSuggestions([]);
    Keyboard.dismiss();

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
            language: "vi",
            fields: "formatted_address",
          },
        }
      );

      const fullAddress =
        response.data.result?.formatted_address || description;
      addressInputRef.current?.setNativeProps({ text: fullAddress });
      updateAddressField(fullAddress, false);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };
  const fetchCustomerInformation = useCallback(async () => {
    try {
      const res = await GetCustomerInformation(appState?.userInfo?.id || 0);
      setCustomerInformation(res.data.data);
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  }, [appState?.userInfo?.id]);
  useFocusEffect(
    useCallback(() => {
      getAccessToken();
      fetchCustomerInformation();
    }, [getAccessToken, fetchCustomerInformation])
  );

  useEffect(() => {
    fetchCustomerInformation();
  }, [fetchCustomerInformation]);
  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topSection}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Thay đổi thông tin của bạn</Text>
          </View>
          {appState ? (
            <>
              {Array.isArray(customerInformation) &&
              customerInformation.length > 0 ? (
                customerInformation.map((item: any, index: number) => (
                  <ItemAddress
                    key={item.id || `address-${index}`}
                    cusName={item.fullName}
                    cusPhone={item.phone}
                    cusAddress={item.address}
                    isDefault={item.isDefault}
                    informationId={item.informationId}
                    onDeleted={fetchCustomerInformation}
                  />
                ))
              ) : (
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <Text
                    style={{
                      color: APP_COLOR.BROWN,
                      fontFamily: FONTS.regular,
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Chưa có thông tin nào. Vui lòng thêm thông tin mới.
                  </Text>
                </View>
              )}
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: APP_COLOR.WHITE,
                  padding: 10,
                  justifyContent: "center",
                  marginHorizontal: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={APP_COLOR.ORANGE}
                />
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 16,
                    color: APP_COLOR.ORANGE,
                  }}
                >
                  Thêm địa chỉ mới
                </Text>
              </Pressable>
            </>
          ) : (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: APP_COLOR.BROWN,
                  fontFamily: FONTS.regular,
                  fontSize: 16,
                }}
              >
                Vui lòng đăng nhập để sử dụng tính năng
              </Text>
            </View>
          )}
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: APP_COLOR.WHITE,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  maxHeight: "80%",
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
                      fontFamily: FONTS.semiBold,
                      fontSize: 20,
                      color: APP_COLOR.BROWN,
                    }}
                  >
                    Thêm địa chỉ mới
                  </Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color={APP_COLOR.BROWN} />
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 14,
                        color: APP_COLOR.BROWN,
                        marginBottom: 5,
                      }}
                    >
                      Tên người nhận
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                        borderRadius: 8,
                        padding: 12,
                        fontFamily: FONTS.regular,
                        fontSize: 16,
                        color: APP_COLOR.BROWN,
                        borderWidth: 1,
                        borderColor: APP_COLOR.BROWN,
                      }}
                      placeholder="Nhập tên người nhận"
                      placeholderTextColor={APP_COLOR.ORANGE}
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                    />
                  </View>
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 14,
                        color: APP_COLOR.BROWN,
                        marginBottom: 5,
                      }}
                    >
                      Số điện thoại
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                        borderRadius: 8,
                        padding: 12,
                        fontFamily: FONTS.regular,
                        fontSize: 16,
                        color: APP_COLOR.BROWN,
                        borderWidth: 1,
                        borderColor: APP_COLOR.BROWN,
                      }}
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={APP_COLOR.ORANGE}
                      keyboardType="phone-pad"
                      value={formData.phone}
                      onChangeText={(text) =>
                        setFormData({ ...formData, phone: text })
                      }
                    />
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 14,
                        color: APP_COLOR.BROWN,
                        marginBottom: 5,
                      }}
                    >
                      Địa chỉ
                    </Text>
                    <View style={{ position: "relative" }}>
                      <TextInput
                        ref={addressInputRef}
                        style={{
                          backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
                          borderRadius: 8,
                          padding: 12,
                          fontFamily: FONTS.regular,
                          fontSize: 16,
                          color: APP_COLOR.BROWN,
                          borderWidth: 1,
                          borderColor: APP_COLOR.BROWN,
                          minHeight: 100,
                          textAlignVertical: "top",
                        }}
                        placeholder="Nhập địa chỉ chi tiết"
                        placeholderTextColor={APP_COLOR.ORANGE}
                        multiline
                        numberOfLines={4}
                        value={formData.address}
                        onChangeText={handleAddressChange}
                        onFocus={() => {
                          if (formData.address.length >= 3) {
                            setShowSuggestions(true);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                      />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <View
                          style={{
                            position: "absolute",
                            top: -210,
                            left: 0,
                            right: 0,
                            backgroundColor: APP_COLOR.WHITE,
                            borderRadius: 8,
                            marginTop: 5,
                            maxHeight: 200,
                            borderWidth: 1,
                            borderColor: APP_COLOR.BROWN,
                            zIndex: 1000,
                            elevation: 5,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                          }}
                        >
                          <ScrollView
                            nestedScrollEnabled
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            style={{ maxHeight: 200 }}
                          >
                            {addressSuggestions.map((item, index) => (
                              <Pressable
                                key={item.place_id || `suggestion-${index}`}
                                style={{
                                  padding: 12,
                                  borderBottomWidth: 1,
                                  borderBottomColor:
                                    APP_COLOR.BACKGROUND_ORANGE,
                                }}
                                onPress={() =>
                                  handleSelectSuggestion(
                                    item.place_id,
                                    item.description
                                  )
                                }
                              >
                                <Text
                                  style={{
                                    fontFamily: FONTS.regular,
                                    fontSize: 14,
                                    color: APP_COLOR.BROWN,
                                  }}
                                >
                                  {item.description}
                                </Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                      {isLoadingSuggestions && (
                        <View
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: APP_COLOR.WHITE,
                            borderRadius: 8,
                            marginTop: 5,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: APP_COLOR.BROWN,
                            zIndex: 1000,
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
                            Đang tìm kiếm...
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 14,
                            color: APP_COLOR.BROWN,
                          }}
                        >
                          Địa chỉ mặc định
                        </Text>
                        <CheckBox
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: APP_COLOR.ORANGE,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          checkedImage={
                            <FontAwesome
                              name="circle"
                              size={14}
                              color={APP_COLOR.ORANGE}
                            />
                          }
                          unCheckedImage={
                            <View style={{ width: 8, height: 8 }} />
                          }
                          isChecked={formData.isDefault}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              isDefault: !formData.isDefault,
                            })
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: APP_COLOR.WHITE,
                        padding: 15,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: APP_COLOR.BROWN,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setFormData({
                          name: formData.name,
                          phone: formData.phone,
                          address: formData.address,
                          isDefault: formData.isDefault ? true : false,
                        });
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONTS.semiBold,
                          fontSize: 16,
                          color: APP_COLOR.BROWN,
                        }}
                      >
                        Hủy
                      </Text>
                    </Pressable>
                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: APP_COLOR.ORANGE,
                        padding: 15,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                      onPress={handleAddAddress}
                    >
                      <Text
                        style={{
                          fontFamily: FONTS.semiBold,
                          fontSize: 16,
                          color: APP_COLOR.WHITE,
                        }}
                      >
                        Thêm địa chỉ
                      </Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
      <View style={styles.bottomSection}>
        <Image source={footerFrame} style={styles.footerImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    minHeight: 150,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  logo: {
    height: 150,
    width: 300,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
  formContainer: {
    gap: 15,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1000,
  },
  saveButton: {
    backgroundColor: APP_COLOR.BROWN,
    width: "60%",
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: APP_COLOR.BROWN,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: APP_COLOR.WHITE,
    fontSize: 17,
    fontFamily: FONTS.regular,
    textAlign: "center",
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 200,
    height: 200,
    resizeMode: "contain",
    zIndex: 1,
  },
});

export default UserInfo;
