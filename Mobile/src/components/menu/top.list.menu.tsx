import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { GetProductType } from "@/utils/api";
import { useEffect, useState } from "react";
import { useCurrentApp } from "@/context/app.context";

interface IProductType {
  productId: number;
  name: string;
}
const IconItem = ({ item }: any) => {
  const { branchId, setSelectedProductTypeId } = useCurrentApp();
  const handlePress = async (name: string, branchId: number) => {
    if (name === "Tất cả") {
      setSelectedProductTypeId(null);
    } else {
      setSelectedProductTypeId(item.productId);
    }
  };
  return (
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => handlePress(item.name, branchId || 0)}
    >
      <View style={styles.iconCircle}>
        <Image source={item.source} style={styles.iconImage} />
      </View>
      <Text style={styles.iconText} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const TopListMenu = () => {
  const [productType, setProductType] = useState<IProductType[]>([]);
  useEffect(() => {
    const fetchProductType = async () => {
      const res = await GetProductType();
      const apiData = (res?.data?.data ?? []) as any[];
      const normalized: IProductType[] = apiData.map((item) => ({
        productId: item?.productId ?? item?.id,
        name: item?.name,
      }));
      setProductType([{ productId: 0, name: "Tất cả" }, ...normalized]);
    };
    fetchProductType();
  }, []);
  const topRowData = productType.filter((_, index) => index % 2 === 0);
  const bottomRowData = productType.filter((_, index) => index % 2 !== 0);
  return (
    <View>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View>
            <View style={[styles.row, { marginBottom: 10 }]}>
              {topRowData.map((item) => (
                <IconItem key={`top-${item.productId}`} item={item} />
              ))}
            </View>
            <View style={styles.row}>
              {bottomRowData.map((item) => (
                <IconItem key={`bottom-${item.productId}`} item={item} />
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
    backgroundColor: APP_COLOR.YELLOW,
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
