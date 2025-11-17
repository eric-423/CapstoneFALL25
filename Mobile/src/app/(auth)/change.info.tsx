import { View, Text, StyleSheet, Image } from "react-native";
import { useCallback, useEffect, useState } from "react";
import ShareButton from "@/components/button/share.button";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import logo from "@/assets/logo.png";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import footerFrame from "@/assets/frame_footer.png";
import {
  GetDetailCustomerInformation,
  UpdateCustomerInformation,
} from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import ShareInput from "@/components/input/share.input";
import { Formik } from "formik";
import { UpdateUserSchema } from "@/utils/validate.schema";
import { FontAwesome } from "@expo/vector-icons";
import CheckBox from "react-native-check-box";
import Toast from "react-native-root-toast";

const ChangeInfoPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInformation, setCustomerInformation] = useState<any>(null);
  const { appState } = useCurrentApp();
  const { id } = useLocalSearchParams();
  const fetchCustomerInformation = useCallback(async () => {
    try {
      const resCusInfor = await GetDetailCustomerInformation(
        appState?.userInfo?.id || 0,
        Number(id)
      );
      setCustomerInformation(resCusInfor.data.data);
    } catch (error) {
      console.error("Error fetching customer information:", error);
    } finally {
      setIsLoading(false);
    }
  }, [appState?.userInfo?.id, id]);
  useFocusEffect(
    useCallback(() => {
      fetchCustomerInformation();
    }, [fetchCustomerInformation])
  );

  const handleUpdateCustomerInformation = async (
    name: string,
    address: string,
    phoneNumber: string,
    isDefault: boolean
  ) => {
    if (!appState?.userInfo?.id || !id) {
      Toast.show("Thông tin người dùng không hợp lệ", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await UpdateCustomerInformation(
        appState.userInfo.id,
        Number(id),
        {
          name,
          address,
          phoneNumber,
          isDefault,
        }
      );
      if (res?.data || res?.status === 200) {
        Toast.show("Cập nhật thông tin thành công", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
        });
        router.back();
      }
    } catch (error: any) {
      console.error("Error updating customer information:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Cập nhật thông tin thất bại. Vui lòng thử lại.";
      Toast.show(errorMessage, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image
          source={logo}
          style={{ height: 150, width: 300, alignSelf: "center" }}
        />
        <View style={{ alignItems: "center", gap: 5 }}>
          <Text
            style={{
              fontSize: 20,
              color: APP_COLOR.BROWN,
              fontFamily: FONTS.semiBold,
            }}
          >
            Thay đổi thông tin của bạn
          </Text>
        </View>
        <Formik
          enableReinitialize
          validationSchema={UpdateUserSchema}
          initialValues={{
            name: customerInformation?.fullName || "",
            address: customerInformation?.address || "",
            phoneNumber: customerInformation?.phone || "",
            isDefault: customerInformation?.isDefault || false,
          }}
          onSubmit={(values) => {
            handleUpdateCustomerInformation(
              values.name,
              values.address,
              values.phoneNumber,
              values.isDefault
            );
          }}
        >
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={{ marginTop: 20, gap: 15 }}>
              <ShareInput
                title="Họ và Tên"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                error={errors.name}
                touched={touched.name}
              />
              <ShareInput
                title="Địa chỉ"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
                error={errors.address}
                touched={touched.address}
              />
              <ShareInput
                title="Số điện thoại"
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
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
                  unCheckedImage={<View style={{ width: 8, height: 8 }} />}
                  isChecked={values.isDefault}
                  onClick={() => {
                    setFieldValue("isDefault", !values.isDefault);
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONTS.regular,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  Địa chỉ mặc định
                </Text>
              </View>
              <View style={{ alignSelf: "center" }}>
                <ShareButton
                  title={"Lưu thay đổi"}
                  btnStyle={{
                    backgroundColor: APP_COLOR.BROWN,
                    width: "50%",
                    borderWidth: 0.5,
                    borderRadius: 10,
                    borderColor: APP_COLOR.BROWN,
                    marginTop: 20,
                  }}
                  textStyle={{
                    color: APP_COLOR.WHITE,
                    fontSize: 17,
                    marginHorizontal: 20,
                    fontFamily: FONTS.regular,
                  }}
                  onPress={() =>
                    handleUpdateCustomerInformation(
                      values.name,
                      values.address,
                      values.phoneNumber,
                      values.isDefault
                    )
                  }
                  loading={isSubmitting}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
      <Image
        source={footerFrame}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 200,
          height: 200,
          resizeMode: "contain",
          zIndex: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 50,
    flex: 1,
  },
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

export default ChangeInfoPage;
