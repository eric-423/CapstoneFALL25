import logo from "@/assets/data/logo.png";
import footerFrame from "@/assets/frame_footer.png";
import ShareButton from "@/components/btnComponent/shareBtn";
import ShareInput from "@/components/btnComponent/shareInput";
import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { typography } from "@/themes/typography";
import { LoginShipper, SendOTP } from "@/utils/api";
import { StaffSignInSchema } from "@/utils/validate.schema";
import { router } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

const WelcomePage = () => {
  const { setAppState } = useCurrentApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [fogotPasword, setFogotPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (
    email: string,
    password: string,
    resetForm: any
  ) => {
    setError(null);
    setLoading(true);
    try {
      const response = await LoginShipper(email, password);
      if (!response) {
        const errorMessage = "Đăng nhập không thành công. Vui lòng thử lại.";
        setError(errorMessage);
        setFogotPassword(true);
        Toast.show(errorMessage, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
        return;
      }

      const userInfo = response?.userInfo;
      const isVerified =
        response?.isVerified ??
        userInfo?.isVerified ??
        userInfo?.verified ??
        userInfo?.emailVerified ??
        userInfo?.isEmailVerified ??
        userInfo?.isActive ??
        true;

      if (!isVerified) {
        try {
          await SendOTP("email", userInfo?.email ?? email, response.token);
        } catch (otpError) {
          console.error("Gửi OTP thất bại:", otpError);
        }
        Toast.show("Tài khoản chưa xác thực. Vui lòng kiểm tra email OTP.", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
          position: -35,
        });
        router.replace({
          pathname: "/(auth)/verify",
          params: {
            identifier: userInfo?.email ?? email,
            channel: "email",
            password,
            tempToken: response.token,
          },
        });
        return;
      }

      setAppState(response);
      router.replace("/(shippers)");
    } catch (error) {
      console.log("Lỗi khi đăng nhập", error);
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";

      const normalizedMsg = (errorMessage || "").toLowerCase();
      const isVerifyError =
        normalizedMsg.includes("chưa được xác thực") ||
        normalizedMsg.includes("xác thực email") ||
        normalizedMsg.includes("verify email") ||
        normalizedMsg.includes("verify your account");

      if (isVerifyError) {
        try {
          await SendOTP("email", email);
          Toast.show("Đã gửi mã OTP xác thực. Vui lòng kiểm tra email.", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
          });
        } catch (otpError) {
          console.error("Không thể gửi OTP xác thực:", otpError);
        }

        router.replace({
          pathname: "/(auth)/verify",
          params: {
            identifier: email,
            channel: "email",
            password,
          },
        });
      } else {
        setError(errorMessage);
        setFogotPassword(true);
        Toast.show(errorMessage, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
          position: -50,
        });
      }

      resetForm();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function prepare() {
      try {
      } catch (e) {
        console.error("Initialization error:", e);
      }
    }
    prepare();
  }, []);
  const handleForgotPassword = async (email: string) => {
    try {
      // Uncomment and implement your forgot password API
      // const res = await forgotPasswordAPI(email);
      // if (res.data) {
      //   Toast.show("Đã gửi email khôi phục mật khẩu", {
      //     duration: Toast.durations.LONG,
      //     textColor: "white",
      //     backgroundColor: APP_COLOR.ORANGE,
      //     opacity: 1,
      //     position: -50,
      //   });
      // }
    } catch (error) {
      Toast.show("Người dùng không tồn tại!!!", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
        position: -50,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.welcomeText}>
            <Image style={styles.imgLogo} source={logo} />
            <Text style={styles.headerText}>
              Đăng nhập bằng email được cấp!
            </Text>
            {error && (
              <Text
                style={{
                  color: APP_COLOR.CANCEL,
                  fontSize: 14,
                  fontFamily: APP_FONT.SEMIBOLD,
                  textAlign: "center",
                  marginTop: 8,
                  marginHorizontal: 16,
                }}
              >
                {error}
              </Text>
            )}
            <View style={styles.welcomeBtn}>
              <Formik
                validationSchema={StaffSignInSchema}
                initialValues={{ email: "", password: "" }}
                onSubmit={(values, { resetForm }) =>
                  handleLogin(values.email, values.password, resetForm)
                }
              >
                {({
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched,
                  handleSubmit,
                }) => (
                  <View>
                    <ShareInput
                      placeholder="Đăng nhập bằng email"
                      keyboardType="ascii-capable"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      error={errors.email}
                      touched={touched.email}
                    />
                    <View style={{ height: 10 }} />
                    <ShareInput
                      placeholder="Mật khẩu"
                      keyboardType="ascii-capable"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      error={errors.password}
                      touched={touched.password}
                    />
                    {fogotPasword && (
                      <Pressable
                        style={{ alignItems: "center", marginTop: 10 }}
                        onPress={() => handleForgotPassword(values.email)}
                      >
                        <Text
                          style={{
                            fontFamily: APP_FONT.SEMIBOLD,
                            color: APP_COLOR.CANCEL,
                            fontSize: 16,
                            textDecorationLine: "underline",
                          }}
                        >
                          Quên mật khẩu?
                        </Text>
                      </Pressable>
                    )}
                    <View style={{ height: 10 }} />
                    <View style={{ marginTop: 10 }}>
                      <ShareButton
                        title="Đăng nhập"
                        onPress={handleSubmit}
                        textStyle={styles.loginBtnText}
                        btnStyle={styles.loginBtn}
                        pressStyle={{ alignSelf: "stretch" }}
                      />
                    </View>
                  </View>
                )}
              </Formik>
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
    marginTop: 30,
    zIndex: 9999,
  },
  welcomeText: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 17,
    color: "#632713",
    fontFamily: APP_FONT.REGULAR,
    textAlign: "center",
    marginBottom: 10,
  },
  imgLogo: {
    height: 150,
    width: 250,
    marginTop: 70,
  },
  welcomeBtn: {
    paddingHorizontal: 30,
    flex: 0.3,
    gap: 20,
  },
  loginBtn: {
    width: 200,
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: "#EC6426",
    marginHorizontal: "auto",
  },
  normalText: {
    ...typography.bodyMedium,
    color: "#632713",
  },
  loginBtnText: {
    ...typography.labelLarge,
    color: APP_COLOR.WHITE,
    paddingVertical: 5,
    fontFamily: APP_FONT.MEDIUM,
  },
});

export default WelcomePage;
