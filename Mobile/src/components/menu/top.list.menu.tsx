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
const icon = [
  {
    key: 1,
    name: "Tất cả",
    source: require("@/assets/icons/com-tam.png"),
    targetScreen: "bestseller",
  },
  {
    key: 2,
    name: "Combo",
    source: require("@/assets/icons/cua-hang.png"),
    targetScreen: "store",
  },
  {
    key: 3,
    name: "Cơm Tấm",
    source: require("@/assets/icons/qua-tang.png"),
    targetScreen: "voucher",
  },
  {
    key: 4,
    name: "Ăn Kèm",
    source: require("@/assets/icons/don-hang.png"),
    targetScreen: "order",
  },
  {
    key: 5,
    name: "Nước giải khát",
    source: require("@/assets/icons/thong-tin.png"),
    targetScreen: "account",
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

const TopListMenu = () => {
  const topRowData = icon.filter((_, index) => index % 2 === 0);
  const bottomRowData = icon.filter((_, index) => index % 2 !== 0);
  return (
    <View>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục</Text>
          <TouchableOpacity onPress={() => console.log("Xem thêm")}>
            <Text style={styles.seeMoreText}>Xem tất cả &gt;</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View>
            <View style={[styles.row, { marginBottom: 10 }]}>
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
  },
  iconWrapper: {
    marginHorizontal: 8,
    alignItems: "center",
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 50,
    flexDirection: "row",
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
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.medium,
    fontSize: 17,
  },
});

export default TopListMenu;
