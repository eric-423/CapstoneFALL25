import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import BannerHome from "@/components/home/banner.home";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { router, useRouter } from "expo-router";
import TodayOffersSection from "./today.offers.home";
import { GetCustomerPromotion } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
const icon = [
  {
    key: 1,
    name: "Thực đơn",
    source: require("@/assets/icons/com-tam.png"),
    targetScreen: "order",
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
    targetScreen: "order.history",
  },
  {
    key: 5,
    name: "Thông tin",
    source: require("@/assets/icons/thong-tin.png"),
    targetScreen: "account",
  },
];

const defaultImages = [
  require("@/assets/icons/com-tam.png"),
  require("@/assets/icons/cua-hang.png"),
  require("@/assets/icons/qua-tang.png"),
  require("@/assets/icons/don-hang.png"),
];
const IconItem = ({ item }: any) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(item.targetScreen);
  };
  return (
    <TouchableOpacity style={styles.iconWrapper} onPress={handlePress}>
      <View style={styles.iconCircle}>
        <Image source={item.source} style={styles.iconImage} />
      </View>
      <Text style={styles.iconText} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};
const TopListHome = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { appState } = useCurrentApp();
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const response = await GetCustomerPromotion();
        if (
          response.data &&
          response.data.status === 0 &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          const mappedOffers = response.data.data
            .map((promotion: any, index: number) => {
              const isActive = promotion.userPromotionStatus === "AVAILABLE";
              return {
                id: String(promotion.id || index),
                promotionId: promotion.id,
                imageSource:
                  defaultImages[index % defaultImages.length] ||
                  require("@/assets/icons/qua-tang.png"),
                discountText: promotion.name || "",
                descriptionText: promotion.description || "",
                promotionData: {
                  id: promotion.id,
                  name: promotion.name,
                  code: promotion.name,
                  description: promotion.description,
                  discountAmount: promotion.value || 0,
                  minOrderAmount: promotion.minimumOrderValue || 0,
                  usageCount: promotion.usageCount || 0,
                  maxNumberOfUses: promotion.maxNumberOfUses || 1,
                  isActive,
                  endDate: promotion.endDate || "",
                  promotionTypeName: promotion.promotionTypeName || "",
                },
                onPress: () => {
                  router.navigate({
                    pathname: "/(user)/voucher/[id]",
                    params: {
                      id: String(promotion.id),
                      name: promotion.name || "",
                      code: promotion.name || "",
                      description: promotion.description || "",
                      discountAmount: String(promotion.value || 0),
                      minOrderAmount: String(promotion.minimumOrderValue || 0),
                      usageCount: String(promotion.usageCount || 0),
                      maxNumberOfUses: String(promotion.maxNumberOfUses || 1),
                      isActive: String(isActive),
                      endDate: promotion.endDate || "",
                      promotionTypeName: promotion.promotionTypeName || "",
                    },
                  });
                },
              };
            })
            .filter((offer: any) => offer.promotionData.isActive);
          setOffers(mappedOffers);
        } else {
          setOffers([]);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const topRowData = icon.filter((_, index) => index % 2 === 0);
  const bottomRowData = icon.filter((_, index) => index % 2 !== 0);
  return (
    <View>
      <BannerHome />
      {appState && <TodayOffersSection offers={offers} />}
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
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginHorizontal: 5,
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

export default TopListHome;
