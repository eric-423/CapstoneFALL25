import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BannerHome from "@/components/home/banner.home";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { router, useRouter } from "expo-router";
import TodayOffersSection from "./today.offers.home";
const icon = [
  {
    key: 1,
    name: "Best Seller",
    source: require("@/assets/icons/com-tam.png"),
    targetScreen: "bestseller",
  },
  {
    key: 2,
    name: "Cửa hàng",
    source: require("@/assets/icons/cua-hang.png"),
    targetScreen: "store",
  },
  {
    key: 3,
    name: "Ưu Đãi",
    source: require("@/assets/icons/qua-tang.png"),
    targetScreen: "voucher",
  },
  {
    key: 4,
    name: "Đơn Hàng",
    source: require("@/assets/icons/don-hang.png"),
    targetScreen: "order",
  },
  {
    key: 5,
    name: "Thông tin",
    source: require("@/assets/icons/thong-tin.png"),
    targetScreen: "account",
  },
];
const sampleOffers = [
  {
    id: "1",
    imageSource: require("@/assets/icons/com-tam.png"),
    discountText: "-50% canh",
    descriptionText: "Dành cho bạn mới",
    onPress: () => console.log("Offer 1 pressed"),
  },
  {
    id: "2",
    imageSource: require("@/assets/icons/cua-hang.png"),
    discountText: "-10% đơn từ 99K",
    descriptionText: "Đặt hàng online",
    onPress: () => console.log("Offer 2 pressed"),
  },
  {
    id: "3",
    imageSource: require("@/assets/icons/qua-tang.png"),
    discountText: "-30% combo",
    descriptionText: "Ưu đãi đặc biệt",
    onPress: () => console.log("Offer 3 pressed"),
  },
  {
    id: "4",
    imageSource: require("@/assets/icons/don-hang.png"),
    discountText: "-20% giao hàng",
    descriptionText: "Miễn phí ship",
    onPress: () => console.log("Offer 4 pressed"),
  },
];
const IconItem = ({ item }: any) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(item.targetScreen);
  };
  return (
    <TouchableOpacity style={styles.iconWrapper} onPress={handlePress}>
      <TouchableOpacity style={styles.iconWrapper} onPress={handlePress}>
        <View style={styles.iconCircle}>
          <Image source={item.source} style={styles.iconImage} />
        </View>
        <Text style={styles.iconText} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const TopListHome = () => {
  const topRowData = icon.filter((_, index) => index % 2 === 0);
  const bottomRowData = icon.filter((_, index) => index % 2 !== 0);
  return (
    <View>
      <BannerHome />
      <TodayOffersSection
        offers={sampleOffers}
        onPressSeeMore={() => {
          console.log("Navigate to all offers");
          router.push("/(tabs)/blog");
        }}
      />
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục</Text>
          <TouchableOpacity onPress={() => console.log("Xem thêm")}>
            <Text style={styles.seeMoreText}>Xem thêm &gt;</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View>
            <View style={styles.row}>
              {topRowData.map((item) => (
                <IconItem key={item.key} item={item} />
              ))}
            </View>
            <View style={styles.row}>
              {bottomRowData.map((item) => (
                <IconItem key={item.key} item={item} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
  },
  row: {
    flexDirection: "row",
    marginVertical: 2,
  },
  iconWrapper: {
    marginHorizontal: 8,
    alignItems: "center",
    backgroundColor: APP_COLOR.YELLOW,
    borderRadius: 50,
    flexDirection: "row",
    alignSelf: "flex-start",
    height: 62,
  },
  iconCircle: {
    backgroundColor: APP_COLOR.DARK_YELLOW,
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  iconText: {
    textAlign: "center",
    paddingRight: 15,
    paddingLeft: 5,
    fontFamily: FONTS.semiBold,
    color: APP_COLOR.BROWN,
    maxWidth: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  seeMoreText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
});

export default TopListHome;
