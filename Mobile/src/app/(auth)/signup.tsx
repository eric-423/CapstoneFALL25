import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import DateInput from "@/components/input/date.input";
import { APP_COLOR } from "@/utils/constant";
import { CustomerSignUpSchema } from "@/utils/validate.schema";
import { Link, router } from "expo-router";
import { Formik } from "formik";
import { Text, View, StyleSheet, Image } from "react-native";
import footerFrame from "@/assets/frame_footer.png";
import logo from "@/assets/logo.png";
import { FONTS, typography } from "@/theme/typography";
import { CustomersSignup, SendOTP } from "@/utils/api";
import Toast from "react-native-root-toast";
const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
});
const handleSignUp = async (
  fullName: string,
  phoneNumber: string,
  password: string,
  dateOfBirth: string
) => {
  try {
    await CustomersSignup(fullName, phoneNumber, password, dateOfBirth);
    const channel = "zalo";
    let otpSent = true;
    try {
      await SendOTP(channel, phoneNumber);
    } catch (otpErr: any) {
      otpSent = false;
    }

    Toast.show(
      otpSent
        ? "Đăng ký thành công! Mã OTP đã được gửi."
        : "Đăng ký thành công, nhưng gửi OTP thất bại. Hãy thử Gửi lại ở màn hình OTP.",
      {
        duration: Toast.durations.LONG,
        backgroundColor: otpSent ? APP_COLOR.ORANGE : APP_COLOR.CANCEL,
      }
    );

    router.replace({
      pathname: "/(auth)/verify",
      params: { phoneNumber, channel },
    });
  } catch (error: any) {
    let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (typeof error.response?.data === "string") {
      errorMessage = error.response.data;
    }
    console.log("Sign up error:", errorMessage, error);
    Toast.show(errorMessage, {
      duration: Toast.durations.LONG,
      backgroundColor: APP_COLOR.CANCEL,
    });
  }
};
const CustomerSignUpPage = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
        zIndex: -1000,
      }}
    >
      <View style={{ flex: 1, zIndex: 1000 }}>
        <Formik
          validationSchema={CustomerSignUpSchema}
          initialValues={{
            fullName: "",
            phoneNumber: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => {
            handleSignUp(
              values.fullName,
              values.phoneNumber,
              values.password,
              values.dateOfBirth
            );
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <View style={styles.itemContainer}>
              <Image
                style={{
                  height: 230,
                  width: 400,
                  marginTop: 30,
                  marginHorizontal: "auto",
                }}
                source={logo}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONTS.medium,
                  color: APP_COLOR.BROWN,
                  marginBottom: 10,
                  alignSelf: "center",
                }}
              >
                Trở thành khách hàng của Tấm Tắc
              </Text>
              <View style={{ gap: 15 }}>
                <ShareInput
                  placeholder="Tên của bạn"
                  placeholderTextColor={APP_COLOR.BROWN}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                  error={errors.fullName}
                  touched={touched.fullName}
                  keyboardType="ascii-capable"
                />
                <ShareInput
                  placeholder="Số điện thoại"
                  placeholderTextColor={APP_COLOR.BROWN}
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  value={values.phoneNumber}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                />
                <DateInput
                  placeholder="Nhập ngày sinh của bạn"
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  value={values.dateOfBirth}
                  error={errors.dateOfBirth}
                  touched={touched.dateOfBirth}
                  minDate="1900-01-01"
                  maxDate={new Date().toISOString().split("T")[0]}
                />
                <ShareInput
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={APP_COLOR.BROWN}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry={true}
                />
                <ShareInput
                  placeholder="Xác nhận lại mật khẩu"
                  placeholderTextColor={APP_COLOR.BROWN}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  secureTextEntry={true}
                />
              </View>

              <View
                style={{
                  marginVertical: 15,
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: APP_COLOR.BROWN,
                    ...typography.bodyMedium,
                  }}
                >
                  Đã có tài khoản?
                </Text>
                <Link href={"/(auth)/welcome"}>
                  <Text
                    style={{
                      color: APP_COLOR.BROWN,
                      textDecorationLine: "underline",
                      fontFamily: FONTS.bold,
                      fontSize: 17,
                    }}
                  >
                    Đăng nhập.
                  </Text>
                </Link>
              </View>
              <ShareButton
                title="Đăng Ký với Khách"
                onPress={() =>
                  handleSignUp(
                    values.fullName,
                    values.phoneNumber,
                    values.password,
                    values.dateOfBirth
                  )
                }
                textStyle={{
                  color: APP_COLOR.WHITE,
                  paddingHorizontal: 15,
                  fontFamily: FONTS.medium,
                  fontSize: 15,
                }}
                btnStyle={{
                  borderRadius: 30,
                  backgroundColor: APP_COLOR.ORANGE,
                  marginHorizontal: "auto",
                  marginBottom: 230,
                }}
                pressStyle={{ alignSelf: "stretch" }}
              />
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

export default CustomerSignUpPage;
