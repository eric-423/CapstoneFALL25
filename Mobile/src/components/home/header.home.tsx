import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
import { GetBranchNearLocation, ReverseGeocodeGoogle } from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
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
  branchItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLOR.WHEAT,
    height: 100,
    position: "relative",
  },
  selectedBranchItem: {
    borderTopWidth: 0.5,
    borderTopColor: APP_COLOR.BROWN,
  },
  branchName: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginBottom: 4,
  },
  selectedBranchName: {
    color: APP_COLOR.ORANGE,
  },
  branchAddress: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    marginBottom: 4,
  },
  branchDistance: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: APP_COLOR.ORANGE,
  },
  checkIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: APP_COLOR.GRAY,
  },
  dropdownMenu: {
    position: "absolute",
    top: 100,
    left: 70,
    right: 10,
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 12,
    maxHeight: 300,
    width: "55%",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 5,
  },
});

const HeaderHome: React.FC<HeaderHomeProps> = ({ pageName }) => {
  const [location, setLocation] = useState<string | null>(null);
  const { cart, locationReal, setLocationReal, branchId, setBranchId } =
    useCurrentApp();
  const [branchInfo, setBranchInfo] = useState<any[]>([]);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const removePlusCode = (address: string): string => {
    if (!address) return address;
    const plusCodePattern = /^[A-Z0-9]{2,}\+[A-Z0-9]{2,}(\s*,\s*|\s+)/i;
    return address.replace(plusCodePattern, "").trim();
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!locationReal) return;
      try {
        const res = await GetBranchNearLocation(locationReal);
        const branches = res.data?.data || res.data || [];
        setBranchInfo(branches);
        if (branches.length > 0) {
          setSelectedBranch((prevSelected: any) => {
            if (prevSelected?.id) {
              const foundBranch = branches.find(
                (b: any) => b.id === prevSelected.id
              );
              if (foundBranch) {
                return foundBranch;
              }
            }
            const firstBranch = branches[0];
            if (firstBranch?.id) {
              setBranchId(firstBranch.id);
            }
            return firstBranch;
          });
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchData();
  }, [locationReal, setBranchId]);
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
        const address = await ReverseGeocodeGoogle(latitude, longitude);
        setLocation(address);
        if (address && !locationReal) {
          setLocationReal(address);
        }
      } catch (error) {
        console.warn("Location error:", error);
        setLocation("Lỗi khi lấy vị trí");
      }
    };

    getLocation();
  }, []);

  const handleSelectBranch = (branch: any) => {
    setSelectedBranch(branch);
    if (branch.branchId) {
      setBranchId(branch.branchId);
    }
    setIsBranchDropdownOpen(false);
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
                  ? removePlusCode(locationReal)
                  : location
                  ? removePlusCode(location)
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
          <View style={{ position: "relative" }}>
            <View style={styles.container}>
              <MaterialCommunityIcons
                name="view-grid-plus"
                size={50}
                color={APP_COLOR.BROWN}
              />
              <View style={{ width: "50%", position: "relative", zIndex: 1 }}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 20,
                    color: APP_COLOR.BROWN,
                  }}
                >
                  Thực đơn
                </Text>
                <Pressable
                  onPress={() => {
                    setIsBranchDropdownOpen(!isBranchDropdownOpen);
                  }}
                  style={{ flexDirection: "row", gap: 5 }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 16,
                      color: APP_COLOR.BROWN,
                    }}
                    numberOfLines={1}
                  >
                    {selectedBranch?.name ||
                      branchInfo?.[0]?.name ||
                      "Chọn chi nhánh"}
                  </Text>
                  <AntDesign
                    name={isBranchDropdownOpen ? "caret-up" : "caret-down"}
                    size={20}
                    color={APP_COLOR.BROWN}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  flexDirection: "row",
                  gap: 10,
                }}
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
            {isBranchDropdownOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView
                  style={{ maxHeight: 250 }}
                  nestedScrollEnabled={true}
                >
                  {branchInfo.length > 0 ? (
                    branchInfo.map((item, index) => (
                      <TouchableOpacity
                        key={item?.id?.toString() || index.toString()}
                        style={[
                          styles.branchItem,
                          selectedBranch?.id === item?.id &&
                            styles.selectedBranchItem,
                        ]}
                        onPress={() => handleSelectBranch(item)}
                      >
                        <Text
                          style={[
                            styles.branchName,
                            selectedBranch?.id === item?.id &&
                              styles.selectedBranchName,
                          ]}
                        >
                          {item?.name || "Chi nhánh"}
                        </Text>
                        {item?.address && (
                          <Text style={styles.branchAddress} numberOfLines={2}>
                            {item.address}
                          </Text>
                        )}
                        {item?.distance && (
                          <Text style={styles.branchDistance}>
                            Khoảng cách: {item.distance}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        Không tìm thấy chi nhánh nào
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
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
