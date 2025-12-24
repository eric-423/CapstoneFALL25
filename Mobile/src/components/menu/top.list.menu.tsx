import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { GetProductType } from "@/utils/api";
import { useEffect, useState } from "react";
import { useCurrentApp } from "@/context/app.context";
import Feather from "@expo/vector-icons/Feather";
interface IProductType {
  productId: number;
  name: string;
  source: any;
}
const IconItem = ({ item }: any) => {
  const { setSelectedProductTypeId } = useCurrentApp();
  const handlePress = async (name: string) => {
    if (name === "Tất cả") {
      setSelectedProductTypeId(null);
    } else {
      setSelectedProductTypeId(item.productId);
    }
  };
  return (
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => handlePress(item.name)}
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

interface TopListMenuProps {
  activeTab: "Danh mục" | "Combo";
  setActiveTab: (tab: "Danh mục" | "Combo") => void;
}

const TopListMenu = ({ activeTab, setActiveTab }: TopListMenuProps) => {
  const { branchId, sortDirection, setSortDirection } = useCurrentApp();
  const [productType, setProductType] = useState<IProductType[]>([]);
  const [comboData, setComboData] = useState<IProductType[]>([]);
  useEffect(() => {
    const getIconForType = (name: string) => {
      const lower = name.toLowerCase();
      if (name === "Tất cả") {
        return require("@/assets/menu/all.png");
      }
      if (lower.includes("cơm tấm")) {
        return require("@/assets/menu/brokenrice.png");
      }
      if (lower.includes("thức uống") || lower.includes("nước")) {
        return require("@/assets/menu/drink.png");
      }
      if (lower.includes("đồ ăn kèm") || lower.includes("món ăn kèm")) {
        return require("@/assets/menu/paired.png");
      }
      return require("@/assets/menu/rice.png");
    };

    const fetchProductType = async () => {
      const res = await GetProductType();
      const apiData = (res?.data?.data ?? []) as any[];
      const normalized: IProductType[] = apiData.map((item) => ({
        productId: item?.productId ?? item?.id,
        name: item?.name,
        source: getIconForType(item?.name || ""),
      }));

      const allItem: IProductType = {
        productId: 0,
        name: "Tất cả",
        source: getIconForType("Tất cả"),
      };

      setProductType([allItem, ...normalized]);
    };

    fetchProductType();
  }, []);
  const displayData = activeTab === "Danh mục" ? productType : comboData;
  const topRowData = displayData.filter((_, index) => index % 2 === 0);
  const bottomRowData = displayData.filter((_, index) => index % 2 !== 0);
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => setActiveTab("Danh mục")}
              style={[
                styles.tab,
                { borderRightWidth: 1, borderRightColor: APP_COLOR.BROWN },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Danh mục" && styles.activeTabText,
                ]}
              >
                Danh mục
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("Combo")}
              style={[styles.tab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Combo" && styles.activeTabText,
                ]}
              >
                Combo
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={[
              styles.tab,
              {
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 5,
                borderRadius: 8,
              },
              sortDirection && { backgroundColor: APP_COLOR.ORANGE },
            ]}
            onPress={async () => {
              if (!branchId) return;
              let newDirection: "ASC" | "DESC" | null = null;
              if (sortDirection === null) {
                newDirection = "ASC";
              } else if (sortDirection === "ASC") {
                newDirection = "DESC";
              } else {
                newDirection = null;
              }
              setSortDirection(newDirection);
            }}
          >
            <Feather
              name="filter"
              size={24}
              color={sortDirection ? APP_COLOR.WHITE : APP_COLOR.BROWN}
            />
            <Text
              style={[
                styles.tabText,
                sortDirection && { color: APP_COLOR.WHITE },
              ]}
            >
              Giá cả
              {sortDirection === "ASC" && " ↑"}
              {sortDirection === "DESC" && " ↓"}
            </Text>
          </Pressable>
        </View>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    borderRadius: 8,
    gap: 40,
  },
  tab: {
    paddingVertical: 8,
    minWidth: 100,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tabText: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: APP_COLOR.BROWN,
  },
  activeTabText: {
    fontFamily: FONTS.bold,
    color: APP_COLOR.ORANGE,
    textDecorationLine: "underline",
  },
  seeMoreText: {
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.medium,
    fontSize: 17,
  },
});

export default TopListMenu;
