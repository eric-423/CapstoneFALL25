import { FONTS } from "@/theme/typography";
import { APP_COLOR, GOOGLE_API_KEY } from "@/utils/constant";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCurrentApp } from "@/context/app.context";
import { useState, useCallback, useRef } from "react";
import { AddNewCustomerInformation, ReverseGeocodeGoogle } from "@/utils/api";
import axios from "axios";
import debounce from "debounce";
import CheckBox from "react-native-check-box";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import Toast from "react-native-root-toast";
import { router } from "expo-router";
import HeaderHome from "@/components/home/header.home";

const AddressNewPage = () => {
  const { appState } = useCurrentApp();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    isDefault: false,
  });
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef<TextInput>(null);

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
          `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
          {
            params: {
              input: input,
              key: GOOGLE_API_KEY,
              language: "vi",
              location: location,
              radius: radius,
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
      } catch (error: any) {
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
        `https://maps.googleapis.com/maps/api/place/details/json`,
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

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show("Vui lòng cho phép ứng dụng truy cập vị trí.", {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.CANCEL,
          textColor: APP_COLOR.WHITE,
        });
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const formattedAddress = await ReverseGeocodeGoogle(
        position.coords.latitude,
        position.coords.longitude
      );
      if (formattedAddress) {
        addressInputRef.current?.setNativeProps({ text: formattedAddress });
        setShowSuggestions(false);
        setAddressSuggestions([]);
        updateAddressField(formattedAddress, false);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Toast.show("Không thể lấy vị trí hiện tại. Vui lòng thử lại.", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.CANCEL,
        textColor: APP_COLOR.WHITE,
      });
    }
  }, [updateAddressField]);

  const handleAddAddress = async () => {
    if (!formData.name.trim()) {
      Toast.show("Vui lòng nhập tên người nhận", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.CANCEL,
        textColor: APP_COLOR.WHITE,
      });
      return;
    }
    if (!formData.phone.trim()) {
      Toast.show("Vui lòng nhập số điện thoại", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.CANCEL,
        textColor: APP_COLOR.WHITE,
      });
      return;
    }
    if (!formData.address.trim()) {
      Toast.show("Vui lòng nhập địa chỉ", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.CANCEL,
        textColor: APP_COLOR.WHITE,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await AddNewCustomerInformation(appState?.userInfo?.id || 0, {
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phone,
        isDefault: formData.isDefault,
      });
      Toast.show("Thêm địa chỉ thành công", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.ORANGE,
        textColor: APP_COLOR.WHITE,
      });
      router.back();
    } catch (error) {
      console.error("Error adding customer information:", error);
      Toast.show("Có lỗi xảy ra khi thêm địa chỉ", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.CANCEL,
        textColor: APP_COLOR.WHITE,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderHome pageName="addressNew" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Thêm địa chỉ mới</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên người nhận</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên người nhận"
              placeholderTextColor={APP_COLOR.ORANGE}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor={APP_COLOR.ORANGE}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.addressHeader}>
              <Text style={styles.label}>Địa chỉ</Text>
              <Pressable onPress={handleUseCurrentLocation}>
                <Text style={styles.useLocationText}>Lấy địa chỉ hiện tại</Text>
              </Pressable>
            </View>
            <View style={styles.addressInputContainer}>
              <TextInput
                ref={addressInputRef}
                style={styles.addressInput}
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
                <View style={styles.suggestionsContainer}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    style={styles.suggestionsScroll}
                  >
                    {addressSuggestions.map((item, index) => (
                      <Pressable
                        key={item.place_id || `suggestion-${index}`}
                        style={styles.suggestionItem}
                        onPress={() =>
                          handleSelectSuggestion(
                            item.place_id,
                            item.description
                          )
                        }
                      >
                        <Text style={styles.suggestionText}>
                          {item.description}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
              {isLoadingSuggestions && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
                </View>
              )}
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxLabel}>Địa chỉ mặc định</Text>
              <CheckBox
                style={styles.checkbox}
                checkedImage={
                  <FontAwesome
                    name="circle"
                    size={14}
                    color={APP_COLOR.ORANGE}
                  />
                }
                unCheckedImage={<View style={{ width: 8, height: 8 }} />}
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
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.submitButton]}
          onPress={handleAddAddress}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Đang thêm..." : "Thêm địa chỉ"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    padding: 16,
  },
  title: {
    marginTop: 20,
    fontFamily: FONTS.semiBold,
    fontSize: 24,
    color: APP_COLOR.BROWN,
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    marginBottom: 8,
  },
  input: {
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    borderRadius: 8,
    padding: 12,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  useLocationText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.ORANGE,
  },
  addressInputContainer: {
    position: "relative",
  },
  addressInput: {
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
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
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
  },
  suggestionsScroll: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  suggestionText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  loadingContainer: {
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
  },
  loadingText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  checkboxLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: APP_COLOR.ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    marginBottom: 50,
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  cancelButton: {
    backgroundColor: APP_COLOR.WHITE,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
  },
  cancelButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: APP_COLOR.BROWN,
  },
  submitButton: {
    backgroundColor: APP_COLOR.ORANGE,
  },
  submitButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: APP_COLOR.WHITE,
  },
});

export default AddressNewPage;
