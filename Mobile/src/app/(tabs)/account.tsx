import { useCurrentApp } from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { FONTS, typography } from "@/theme/typography";
import logo from "@/assets/logo.png";
import ShareButton from "@/components/button/share.button";
import icon from "@/assets/icons/loi-chuc.png";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import CustomerPoint from "@/components/account/user.point";

const getCurrentDateTime = (): string => {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 5 && hour < 11) {
    return "Buổi sáng năng lượng!";
  } else if (hour >= 11 && hour < 13) {
    return "Buổi trưa vui vẻ!";
  } else if (hour >= 13 && hour < 18) {
    return "Buổi chiều nhẹ nhàng!";
  } else {
    return "Buổi tối thư giãn!";
  }
};
const ScreenWidth = Dimensions.get("screen").width;
const AccountPage = () => {
  const [decodeToken, setDecodeToken] = useState<any>("");
  const {
    appState,
    setAppState,
    setCart,
    setRestaurant,
    setBranchId,
    setSelectedProductTypeId,
    setLocationReal,
    setBranchName,
  } = useCurrentApp();
  const [time, setTime] = useState("");
  const decodeAndSetToken = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const decoded = jwtDecode(token);
        setDecodeToken(decoded);
      } else {
        setDecodeToken("");
      }
    } catch (error) {
      console.error("Error retrieving or decoding access token:", error);
      setDecodeToken("");
    }
  };

  useEffect(() => {
    setTime(getCurrentDateTime());
  }, [setAppState]);

  useEffect(() => {
    decodeAndSetToken();
  }, [appState]);
  useFocusEffect(
    useCallback(() => {
      decodeAndSetToken();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn đăng xuất người dùng ?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: async () => {
          setCart({});
          setAppState(null);
          setRestaurant(null);
          setBranchId(1);
          setSelectedProductTypeId(null);
          setLocationReal("");
          setBranchName(null);
          await AsyncStorage.removeItem("access_token");
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
      }}
    >
      <View style={styles.headerContainer}>
        <View style={{ marginTop: 10 }}>
          <Text
            style={[
              styles.text,
              { fontFamily: FONTS.medium, fontSize: 19, textAlign: "center" },
            ]}
          >
            {time}
          </Text>
          {appState && (
            <Text
              style={[
                styles.text,
                {
                  fontFamily: FONTS.bold,
                  color: APP_COLOR.ORANGE,
                  textAlign: "center",
                },
              ]}
            >
              {decodeToken?.name ? decodeToken?.name : "Tấm Tắc"}
            </Text>
          )}
        </View>
        <Image source={logo} style={styles.img} />
      </View>
      {!appState && (
        <>
          <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
            <Text
              style={{
                color: APP_COLOR.BROWN,
                fontSize: 17,
                fontFamily: FONTS.regular,
                textAlign: "center",
              }}
            >
              Hãy đăng nhập/đăng ký để nhận được các thông tin ưu đã từ Tấm Tắc
              nhé.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              marginHorizontal: 10,
              justifyContent: "space-around",
            }}
          >
            <ShareButton
              title="Đăng Nhập"
              onPress={() => router.push("/(auth)/welcome")}
              textStyle={styles.loginBtnText}
              btnStyle={styles.loginBtn}
            />
            <ShareButton
              title="Đăng Ký"
              onPress={() => router.push("/(auth)/signup")}
              textStyle={styles.loginBtnText}
              btnStyle={styles.loginBtn}
            />
          </View>
        </>
      )}
      {appState && (
        <View
          style={{
            position: "relative",
            bottom: -30,
            backgroundColor: APP_COLOR.ORANGE,
            marginHorizontal: 10,
            padding: 5,
            borderRadius: 10,
            width: ScreenWidth * 0.85,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              backgroundColor: APP_COLOR.ORANGE,
              borderWidth: 1,
              borderColor: APP_COLOR.WHITE,
              borderRadius: 10,
              paddingTop: 15,
              paddingBottom: 20,
            }}
          >
            <Image source={icon} style={{ height: 39, width: 80 }} />
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        {appState && (
          <CustomerPoint
            fullName={appState?.userInfo?.fullName || ""}
            phoneNumber={appState?.userInfo?.phoneNumber || ""}
            memberPoint={appState?.userInfo?.memberPoint || 0}
          />
        )}
        <Pressable
          onPress={() => router.navigate("/(user)/account/info")}
          style={styles.btnStyle}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Feather name="user-check" size={25} color={APP_COLOR.BROWN} />
            <Text style={styles.btnText}>Cập nhật thông tin</Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={APP_COLOR.BROWN}
          />
        </Pressable>

        <Pressable
          onPress={() => router.navigate("/(user)/account/password")}
          style={styles.btnStyle}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="password" size={25} color={APP_COLOR.BROWN} />
            <Text style={styles.btnText}>Thay đổi mật khẩu</Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={APP_COLOR.BROWN}
          />
        </Pressable>
        <Pressable
          onPress={() => router.navigate("/(user)/account/voucher")}
          style={styles.btnStyle}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Feather name="gift" size={25} color={APP_COLOR.BROWN} />
            <Text style={styles.btnText}>Ưu đãi của bạn</Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={APP_COLOR.BROWN}
          />
        </Pressable>

        <Pressable
          onPress={() => router.navigate("/(tabs)/order.history")}
          style={styles.btnStyle}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <SimpleLineIcons name="handbag" size={24} color={APP_COLOR.BROWN} />
            <Text style={styles.btnText}>Lịch sử đơn hàng</Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={APP_COLOR.BROWN}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (appState) {
              handleLogout();
            } else {
              Alert.alert("Lỗi", "Bạn chưa đăng nhập");
            }
          }}
          style={[styles.btnStyle]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="logout" size={25} color={APP_COLOR.BROWN} />
            <Text style={styles.btnText}>Đăng xuất</Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={APP_COLOR.BROWN}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            Alert.alert("App Tấm Tắc", "Ứng dụng Cơm Tấm Tắc ver 1.0.6")
          }
          style={[styles.btnStyle, , { marginBottom: 10 }]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="info-outline"
              size={25}
              color={APP_COLOR.BROWN}
            />
            <Text style={styles.btnText}>Về ứng dụng</Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={APP_COLOR.BROWN}
          />
        </Pressable>
      </View>
      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Text style={[styles.text, { fontSize: 15, fontFamily: FONTS.medium }]}>
          Mọi thắc mắc vui lòng liên hệ qua CSKH:
        </Text>
        <Text style={[styles.text, { fontSize: 15, fontFamily: FONTS.medium }]}>
          Hotline:{" "}
          <Text style={[styles.text, { color: APP_COLOR.ORANGE }]}>
            0889679561
          </Text>
        </Text>
        <Text style={[styles.text, { fontSize: 15, fontFamily: FONTS.medium }]}>
          Email:{" "}
          <Text style={[styles.text, { color: APP_COLOR.ORANGE }]}>
            minhduy.fptu.se@gmail.com
          </Text>
        </Text>
      </View>
      <View
        style={{ backgroundColor: APP_COLOR.BACKGROUND_ORANGE, height: 30 }}
      ></View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  text: { color: APP_COLOR.BROWN, fontSize: 17, fontFamily: FONTS.regular },
  img: {
    height: 100,
    width: 150,
    alignSelf: "center",
  },
  btnText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingBottom: 3,
    marginBottom: 3,
    borderBottomColor: APP_COLOR.BROWN,
    borderBottomWidth: 0.5,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  loginBtnText: {
    ...typography.labelLarge,
    color: APP_COLOR.WHITE,
    paddingVertical: 5,
    fontFamily: FONTS.medium,
  },
  loginBtn: {
    width: ScreenWidth * 0.35,
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#EC6426",
    marginHorizontal: "auto",
  },
  buttonContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: APP_COLOR.DARK_YELLOW,
    padding: 10,
    borderRadius: 10,
  },
  btnStyle: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default AccountPage;
