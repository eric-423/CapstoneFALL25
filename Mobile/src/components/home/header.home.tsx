import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
interface HeaderHomeProps {
  pageName: string;
}
const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 10,
    justifyContent: "space-around",
  },
  notificationWrapper: {
    backgroundColor: APP_COLOR.BROWN,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

const HeaderHome: React.FC<HeaderHomeProps> = ({ pageName }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { cart } = useCurrentApp();
  const { locationReal } = useCurrentApp();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await axios.get(
        //   `${BASE_URL}/branches/distance?destination=${locationReal}`
        // );
        // setBranchInfo(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Không có quyền truy cập vị trí");
          return;
        }

        const locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = locationData.coords;

        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address.length > 0) {
          const { city, region, subregion, district } = address[0];
          const parts = [];
          if (city) parts.push(city);
          if (region) parts.push(region);
          if (subregion || district) parts.push(district || subregion);
          const fullAddress = parts.join(", ");
          setLocation(fullAddress || "Không tìm thấy địa chỉ");
        } else {
          setLocation("Không tìm thấy địa chỉ");
        }
      } catch (error) {
        console.warn("Location error:", error);
        setLocation("Lỗi khi lấy vị trí");
      }
    };

    getLocation();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderHeaderContent = () => {
    switch (pageName) {
      case "homePage":
        return (
          <View style={styles.container}>
            <Entypo name="location-pin" size={50} color={APP_COLOR.BROWN} />
            <View style={{ width: "55%" }}>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  color: APP_COLOR.BROWN,
                }}
              >
                Giao đến:
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.medium,
                  width: "90%",
                  color: APP_COLOR.BROWN,
                }}
              >
                {locationReal
                  ? locationReal
                  : location
                  ? location
                  : "Đang lấy vị trí..."}
              </Text>
            </View>

            <View
              style={{ alignItems: "flex-end", flexDirection: "row", gap: 10 }}
            >
              <View style={styles.notificationWrapper}>
                <Feather
                  name="shopping-cart"
                  size={24}
                  color={APP_COLOR.WHITE}
                />
              </View>
              <View
                style={{
                  backgroundColor: APP_COLOR.ORANGE,
                  width: 25,
                  height: 25,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: 30,
                  top: -5,
                }}
              >
                <Text
                  style={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
                >
                  {cart?.mock_restaurant_1?.quantity || 0}
                </Text>
              </View>
              <View style={styles.notificationWrapper}>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={APP_COLOR.WHITE}
                />
              </View>
            </View>
          </View>
        );

      case "orderHistory":
        return (
          <View style={styles.container}>
            <View
              style={{
                width: "89%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="history"
                size={50}
                color={APP_COLOR.BROWN}
              />

              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 20,
                  color: APP_COLOR.BROWN,
                  marginLeft: 10,
                }}
              >
                Lịch sử đơn hàng
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={styles.notificationWrapper}>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={APP_COLOR.WHITE}
                />
              </View>
            </View>
          </View>
        );
      case "orderPage":
        return (
          <View style={styles.container}>
            <MaterialCommunityIcons
              name="view-grid-plus"
              size={50}
              color={APP_COLOR.BROWN}
            />
            <View style={{ width: "55%" }}>
              <Text
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: 20,
                  color: APP_COLOR.BROWN,
                  marginLeft: 10,
                }}
              >
                Thực đơn
              </Text>
            </View>
            <View
              style={{ alignItems: "flex-end", flexDirection: "row", gap: 10 }}
            >
              <Pressable
                onPress={() => router.navigate("/(auth)/search")}
                style={styles.notificationWrapper}
              >
                <Ionicons name="search" size={24} color={APP_COLOR.WHITE} />
              </Pressable>

              <Pressable
                onPress={() => router.navigate("/(user)/order/cart")}
                style={styles.notificationWrapper}
              >
                <SimpleLineIcons
                  name="handbag"
                  size={24}
                  color={APP_COLOR.WHITE}
                />
                <View
                  style={{
                    backgroundColor: APP_COLOR.ORANGE,
                    width: 25,
                    height: 25,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    left: 30,
                    top: -5,
                  }}
                >
                  <Text
                    style={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
                  >
                    {cart?.mock_restaurant_1?.quantity || 0}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        );
      case "cartPage":
        return (
          <View style={styles.container}>
            <View
              style={{
                width: "87%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                name="handbag"
                size={45}
                color={APP_COLOR.BROWN}
              />
              <View style={{ width: "55%" }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 20,
                    color: APP_COLOR.BROWN,
                    marginLeft: 10,
                  }}
                >
                  Giỏ hàng
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={styles.notificationWrapper}>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={APP_COLOR.WHITE}
                />
              </View>
            </View>
          </View>
        );
      case "placeOrderPage":
        return (
          <View style={[styles.container, { marginLeft: 0, height: 70 }]}>
            <View
              style={{
                width: "87%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                name="handbag"
                size={40}
                color={APP_COLOR.BROWN}
              />
              <View style={{ width: "55%" }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 20,
                    color: APP_COLOR.BROWN,
                    marginLeft: 10,
                  }}
                >
                  Đặt hàng
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return <></>;
    }
  };

  return <View>{renderHeaderContent()}</View>;
};

export default HeaderHome;
