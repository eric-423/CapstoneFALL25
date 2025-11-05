import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import ShareButton from "@/components/button/share.button";
import { APP_COLOR } from "@/utils/constant";
import TextBetweenLine from "@/components/button/text.between.line";
import logo from "@/assets/logo.png";
import { FONTS, typography } from "@/theme/typography";
import { useState, useCallback } from "react";
import { useCurrentApp } from "@/context/app.context";
import footerFrame from "@/assets/frame_footer.png";
import { Formik } from "formik";
import ShareInput from "@/components/input/share.input";
import { CustomerSignInSchema } from "@/utils/validate.schema";
import { Link, router } from "expo-router";
import { LoginCustomers } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

const WelcomePage = () => {
  const { setAppState } = useCurrentApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [fogotPasword, setFogotPassword] = useState(false);
  const handleLogin = useCallback(
    async (phoneNumber: string, password: string, resetForm: any) => {
      console.log("handleLogin được gọi với:", { phoneNumber, password });
      try {
        setLoading(true);
        const res = await LoginCustomers(phoneNumber, password);
        console.log("Login response:", res);
        setLoading(false);
        if (res.data) {
          await AsyncStorage.setItem("access_token", res.data.token);
          setAppState(res.data);
          router.replace({
            pathname: "/(tabs)",
            params: { access_token: res.data.token, isLogin: 1 },
          });
        } else {
          resetForm();
          setFogotPassword(true);
          Toast.show("Đăng nhập không thành công", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
          });
        }
      } catch (error: any) {
        console.log("Lỗi khi đăng nhập", error);
        setLoading(false);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Đăng nhập thất bại. Vui lòng thử lại.";
        Toast.show(errorMessage, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
        setFogotPassword(true);
      }
    },
    [setAppState]
  );
  const handleForgotPassword = async (phoneNumber: string) => {
    // try {
    //   const res = await forgotPasswordAPI(email);
    //   if (res.data) {
    //     Toast.show("Đã gửi email khôi phục mật khẩu", {
    //       duration: Toast.durations.LONG,
    //       textColor: "white",
    //       backgroundColor: APP_COLOR.ORANGE,
    //       opacity: 1,
    //       position: -50,
    //     });
    //   }
    // } catch (error) {
    //   Toast.show("Người dùng không tồn tại!!!", {
    //     duration: Toast.durations.LONG,
    //     textColor: "white",
    //     backgroundColor: APP_COLOR.CANCEL,
    //     opacity: 1,
    //     position: -50,
    //   });
    // }
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.welcomeText}>
            <Image style={styles.imgLogo} source={logo} />
            <Text style={styles.headerText}>Chào mừng bạn đến với Tấm Tắc</Text>
            <View style={styles.welcomeBtn}>
              <TextBetweenLine
                title="Đăng nhập với"
                textStyle={typography.bodyMedium}
              />
              <View>
                <Formik
                  validationSchema={CustomerSignInSchema}
                  initialValues={{ phoneNumber: "", password: "" }}
                  onSubmit={() => {}}
                >
                  {({
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    resetForm,
                  }) => (
                    <View>
                      <ShareInput
                        placeholder="Nhập sdt của bạn"
                        keyboardType="phone-pad"
                        onChangeText={handleChange("phoneNumber")}
                        onBlur={handleBlur("phoneNumber")}
                        value={values.phoneNumber}
                        error={errors.phoneNumber}
                        touched={touched.phoneNumber}
                      />
                      <View style={{ height: 10 }}></View>
                      <ShareInput
                        placeholder="Mật khẩu"
                        keyboardType="ascii-capable"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        error={errors.password}
                        touched={touched.password}
                        secureTextEntry={true}
                      />
                      {fogotPasword && (
                        <Pressable
                          style={{ alignItems: "center", marginTop: 10 }}
                          onPress={() =>
                            handleForgotPassword(values.phoneNumber)
                          }
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.semiBold,
                              color: APP_COLOR.CANCEL,
                              fontSize: 16,
                              textDecorationLine: "underline",
                            }}
                          >
                            Quên mật khẩu?
                          </Text>
                        </Pressable>
                      )}
                      <ShareButton
                        title="Đăng nhập"
                        onPress={() => {
                          handleLogin(
                            values.phoneNumber,
                            values.password,
                            resetForm
                          );
                        }}
                        textStyle={styles.loginBtnText}
                        btnStyle={styles.loginBtn}
                        pressStyle={{ alignSelf: "stretch" }}
                      />
                    </View>
                  )}
                </Formik>
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.normalText}>Chưa có tài khoản?</Text>
                  <Link href={"/signup"} style={styles.signUpText}>
                    Đăng ký tài khoản.
                  </Link>
                </View>
              </View>
            </View>
          </View>
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
          }}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  welcomeText: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    bottom: 40,
    fontSize: 20,
    color: "#632713",
    fontFamily: FONTS.regular,
  },
  imgLogo: {
    height: 230,
    width: 400,
    marginTop: 100,
  },
  welcomeBtn: {
    paddingHorizontal: 30,
    flex: 0.3,
    gap: 20,
  },
  signUpText: {
    textDecorationLine: "underline",
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.bold,
  },
  welcomeLoginBtn: {
    flexDirection: "row",
    marginHorizontal: "auto",
  },
  loginBtn: {
    width: 200,
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#EC6426",
    marginHorizontal: "auto",
    marginTop: 20,
  },
  loginBtnFast: {
    width: 50,
    height: 50,
    borderRadius: 50,
    paddingVertical: 10,
    marginLeft: 20,
    backgroundColor: "#EC6426",
  },
  normalText: {
    ...typography.bodyMedium,
    color: "#632713",
  },
  hrefLink: { marginTop: 5 },
  loginBtnText: {
    ...typography.labelLarge,
    color: APP_COLOR.WHITE,
    paddingVertical: 5,
    fontFamily: FONTS.medium,
  },
  quickLoginButton: {
    backgroundColor: APP_COLOR.ORANGE,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  quickLoginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WelcomePage;
