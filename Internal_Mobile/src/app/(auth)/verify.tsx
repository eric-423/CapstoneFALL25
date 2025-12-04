import footerFrame from "@/assets/frame_footer.png";
import logo from "@/assets/logo.png";
import LoadingOverlay from "@/components/loading/overlay";
import { APP_COLOR } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import { FONTS } from "@/themes/typography";
import { LoginShipper, SendOTP, TTLOtp, VeryfyOTP } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-root-toast";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  welcomeText: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 130,
  },
  heading: {
    fontSize: 25,
    fontWeight: "600",
    marginVertical: 20,
  },
  headerText: {
    top: 5,
    fontSize: 20,
    color: "#632713",
    fontFamily: FONTS.regular,
  },
  imgLogo: {
    height: 230,
    width: 400,
    marginTop: 70,
  },
  resendText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.medium,
  },
  resendTextDisabled: {
    color: APP_COLOR.GREY,
    fontFamily: FONTS.medium,
  },
  countdownText: {
    color: APP_COLOR.ORANGE,
    fontFamily: FONTS.medium,
  },
});

const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const VerifyPage = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const otpRef = useRef<OTPTextView>(null);
  const [code, setCode] = useState<string>("");
  const { identifier, channel, password, tempToken } = useLocalSearchParams<{
    identifier?: string;
    channel?: string;
    password?: string;
    tempToken?: string;
  }>();
  const identifierStr = typeof identifier === "string" ? identifier : "";
  const channelStr = typeof channel === "string" ? channel : "email";
  const tempTokenStr =
    typeof tempToken === "string" && tempToken.length > 0
      ? tempToken
      : undefined;
  const passwordStr = typeof password === "string" ? password : "";
  const { setAppState } = useCurrentApp();

  useEffect(() => {
    if (!identifierStr) return;
    const getCountdown = async () => {
      try {
        const res = await TTLOtp(channelStr, identifierStr, tempTokenStr);
        setCountdown(res?.data?.data ?? 0);
      } catch (err: any) {
        console.log(
          "TTL OTP error:",
          err?.response?.status,
          err?.response?.data
        );
        setCountdown(0);
      }
    };

    getCountdown();
    const intervalId = setInterval(() => {
      getCountdown();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [identifierStr, channelStr, tempTokenStr]);

  const verifyOTP = async (inputOtp: string) => {
    if (!identifierStr) {
      Toast.show("Thiếu thông tin email xác thực", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
      return;
    }
    if (!passwordStr) {
      Toast.show("Vui lòng nhập lại mật khẩu trước khi xác thực", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
      return;
    }
    try {
      Keyboard.dismiss();
      setIsSubmit(true);
      const verifyRes = await VeryfyOTP(
        channelStr,
        identifierStr,
        inputOtp,
        tempTokenStr
      );
      if (verifyRes) {
        Toast.show("Xác thực tài khoản thành công", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
          position: -35,
        });
        const res = await LoginShipper(identifierStr, passwordStr);
        if (res) {
          await AsyncStorage.setItem("access_token", res.token);
          setAppState(res);
          router.replace("/(shippers)");
        } else {
          Toast.show("Đăng nhập không thành công", {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
          });
        }
      } else {
        Toast.show("Mã OTP không hợp lệ", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
      }
    } catch (error) {
      console.log("Lỗi không thể xác thực được mã OTP", error);
      Toast.show("Không thể xác thực. Vui lòng thử lại.", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || !identifierStr) return;
    otpRef?.current?.clear();
    try {
      await SendOTP(channelStr, identifierStr, tempTokenStr);
      const ttlRes = await TTLOtp(channelStr, identifierStr, tempTokenStr);
      const newTtl = ttlRes?.data?.ttl ?? ttlRes?.data?.data ?? 0;
      setCountdown(newTtl);
      Toast.show("Đã gửi lại mã OTP", {
        duration: Toast.durations.SHORT,
        textColor: "white",
        backgroundColor: APP_COLOR.ORANGE,
        opacity: 1,
      });
    } catch (error) {
      console.error("Error resending code:", error);
      Toast.show("Không thể gửi lại mã. Vui lòng thử lại sau.", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.ORANGE,
        opacity: 1,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeText}>
        <Image style={styles.imgLogo} source={logo} />
        <Text style={styles.headerText}>Chào mừng bạn đến với Tấm Tắc</Text>
        {countdown <= 0 ? (
          <Text
            style={{
              marginVertical: 10,
              fontFamily: FONTS.regular,
              color: APP_COLOR.CANCEL,
              marginHorizontal: 10,
              textAlign: "center",
            }}
          >
            OTP đã hết hạn, vui lòng gửi lại mã
          </Text>
        ) : (
          <Text
            style={{
              marginVertical: 10,
              fontFamily: FONTS.regular,
              color: APP_COLOR.BROWN,
              marginHorizontal: 10,
              textAlign: "center",
            }}
          >
            Mã OTP đã được gửi về email {identifierStr}
          </Text>
        )}
        <View style={{ marginVertical: 20 }}>
          <OTPTextView
            ref={otpRef}
            handleTextChange={(val: string) => {
              setCode(val);
              if (!isSubmit && identifierStr && val.length === 6) {
                verifyOTP(val);
              }
            }}
            autoFocus
            inputCount={6}
            inputCellLength={1}
            tintColor={APP_COLOR.ORANGE}
            offTintColor={APP_COLOR.BROWN}
            textInputStyle={{
              height: 45,
              width: 45,
              borderWidth: 1,
              borderColor: APP_COLOR.BROWN,
              borderBottomWidth: 1,
              borderRadius: 5,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <Text style={styles.resendText}>Không nhận được mã xác nhận, </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={countdown > 0}>
            <Text
              style={[
                countdown > 0 ? styles.resendTextDisabled : styles.resendText,
                { textDecorationLine: "underline" },
              ]}
            >
              {countdown > 0
                ? `Gửi lại (${formatCountdown(countdown)})`
                : "Gửi lại"}
            </Text>
          </TouchableOpacity>
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
      {isSubmit && <LoadingOverlay />}
    </View>
  );
};

export default VerifyPage;
