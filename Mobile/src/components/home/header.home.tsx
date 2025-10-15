import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { useCurrentApp } from "@/context/app.context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
interface HeaderHomeProps {
  onBranchSelect: (id: string) => void;
}
const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationWrapper: {
    backgroundColor: APP_COLOR.BROWN,
    width: 50,
    height: 50,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

const HeaderHome: React.FC<HeaderHomeProps> = ({ onBranchSelect }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [branchesInfo, setBranchInfo] = useState([]);
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
  const handleBranchSelect = (branch: any) => {
    onBranchSelect(branch.branch.id);
    setIsModalVisible(false);
  };
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const locationData = await Location.getCurrentPositionAsync({});
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
      }
    };

    getLocation();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
      <View style={{ alignItems: "flex-end", flexDirection: "row", gap: 10 }}>
        <View style={styles.notificationWrapper}>
          <Feather name="shopping-cart" size={24} color={APP_COLOR.WHITE} />
        </View>
        <View
          style={{
            backgroundColor: APP_COLOR.ORANGE,
            width: 25,
            height: 25,
            borderRadius: "100%",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 30,
            top: -5,
          }}
        >
          <Text style={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}>
            1
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
};

export default HeaderHome;
