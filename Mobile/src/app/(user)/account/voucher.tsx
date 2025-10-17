import { useEffect, useState } from "react";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import VoucherComponent from "@/components/account/user.voucher";
import CustomerPoint from "@/components/account/user.point";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
const Voucher = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [decodeToken, setDecodeToken] = useState<any>("");
  const sampleVouchers = [
    {
      promotionId: 1,
      name: "WELCOME10",
      discountAmount: 50000,
      endDate: "2024-12-31",
      code: "WELCOME10",
    },
    {
      promotionId: 2,
      name: "SALE20",
      discountAmount: 100000,
      endDate: "2024-12-25",
      code: "SALE20",
    },
    {
      promotionId: 3,
      name: "NEWUSER15",
      discountAmount: 75000,
      endDate: "2024-12-20",
      code: "NEWUSER15",
    },
    {
      promotionId: 4,
      name: "HOLIDAY50",
      discountAmount: 200000,
      endDate: "2025-01-15",
      code: "HOLIDAY50",
    },
    {
      promotionId: 5,
      name: "COMBO30",
      discountAmount: 150000,
      endDate: "2024-12-30",
      code: "COMBO30",
    },
  ];
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
    const fetchVouchers = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setVouchers(sampleVouchers);
          setIsLoading(false);
        }, 500);
      } catch (e) {
        setVouchers([]);
        setIsLoading(false);
      }
    };
    fetchVouchers();
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() => router.navigate("/(tabs)")}
          style={{ flex: 0.5 }}
        >
          <AntDesign name="arrow-left" size={24} color={APP_COLOR.BROWN} />
        </Pressable>
        <Text style={styles.text}>Mã ưu đãi của tôi</Text>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <CustomerPoint
          fullName={decodeToken.fullName}
          phoneNumber={decodeToken.phoneNumber}
          email={decodeToken.email}
        />
      </View>
      {!isLoggedIn ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONTS.medium,
              color: APP_COLOR.BROWN,
              textAlign: "center",
            }}
          >
            Hãy đăng nhập để nhận ưu đãi
          </Text>
        </View>
      ) : (
        <>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải mã ưu đãi...</Text>
            </View>
          ) : vouchers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bạn chưa có mã ưu đãi nào</Text>
              <Text style={styles.emptySubText}>
                Hãy mua sắm để nhận được các mã ưu đãi hấp dẫn!
              </Text>
            </View>
          ) : (
            <FlatList
              data={vouchers}
              renderItem={({ item }) => (
                <VoucherComponent
                  code={item.name}
                  description={`Giảm ${item.discountAmount.toLocaleString()}đ`}
                  date={
                    item.endDate
                      ? new Date(item.endDate).toLocaleDateString()
                      : ""
                  }
                  promotionId={item.promotionId}
                />
              )}
              keyExtractor={(item) => item.promotionId?.toString() || item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  text: {
    alignSelf: "center",
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: APP_COLOR.BROWN,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: APP_COLOR.GRAY,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 10,
  },
});
export default Voucher;
