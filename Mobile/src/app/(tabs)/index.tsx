import CustomFlatList from "@/components/customFlatList/CustomFlatList";
import CollectionHome, {
  ModalProvider,
} from "@/components/home/collection.home";
import HeaderHome from "@/components/home/header.home";
import SearchHome from "@/components/home/search.home";
import TopListHome from "@/components/home/top.list.home";
import { useCurrentApp } from "@/context/app.context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import { currencyFormatter } from "@/utils/cart";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PopupSale } from "@/app/(auth)/popup.sale";

interface ITem {
  name: string;
  productTypeId: number;
}
const MOCK_COLLECTIONS: ITem[] = [
  { name: "Món ăn được yêu thích", productTypeId: 1 },
];
const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  const [showPriceUpdate, setShowPriceUpdate] = useState(false);
  const [priceUpdateAmount, setPriceUpdateAmount] = useState(0);
  const [collectionData, setCollectionData] = useState([]);
  const { branchId, setBranchId } = useCurrentApp();
  const { access_token } = useLocalSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storeAccessToken = async () => {
      try {
        if (access_token) {
          await AsyncStorage.setItem("access_token", access_token as string);
        }
      } catch (error) {
        console.error("Error saving access token:", error);
      }
    };
    storeAccessToken();
  }, [access_token]);
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);
  useEffect(() => {
    const timer = setTimeout(
      () => setCollectionData(MOCK_COLLECTIONS as never[]),
      200
    );
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setShowPopup(true), 600);
    return () => clearTimeout(t);
  }, [mounted]);

  return (
    <View
      style={{
        flexGrow: 1,
        backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
      }}
    >
      <CustomFlatList
        data={collectionData}
        style={styles.list}
        renderItem={({ item }: { item: ITem }) => (
          <ModalProvider>
            <CollectionHome
              name={item.name}
              id={item.productTypeId}
              branchId={branchId}
            />
          </ModalProvider>
        )}
        HeaderComponent={<HeaderHome pageName="homePage" />}
        TopListElementComponent={<TopListHome />}
      />
      {showPriceUpdate && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.priceUpdateContainer}
        >
          <Text style={styles.priceUpdateText}>
            {priceUpdateAmount > 0 ? "+" : ""}
            {currencyFormatter(priceUpdateAmount)}
          </Text>
        </Animated.View>
      )}
      {showPopup && <PopupSale onClose={() => setShowPopup(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderColor: "red",
    borderWidth: 5,
    height: 100,
    marginBottom: 6,
    width: "100%",
  },
  item: {
    borderColor: "green",
    borderWidth: 1,
    height: 250,
    marginBottom: 10,
    width: "100%",
  },
  list: {
    overflow: "hidden",
  },
  sticky: {
    backgroundColor: "#2555FF50",
    borderColor: "blue",
    borderWidth: 5,
    height: 100,
    marginBottom: 6,
    width: "100%",
  },
  priceUpdateContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 1001,
  },
  priceUpdateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default HomePage;
