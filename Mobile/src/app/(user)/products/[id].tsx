import { GetProductDetailByBranch } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface IProductDetail {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  productType: string;
  productTypeId: number;
  quantityInBranch: number;
  inStock: boolean;
  calories?: number;
}

const ProductDetail = () => {
  const { id, branchId } = useLocalSearchParams();
  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const productIdNum =
    typeof id === "string" ? Number(id) : Array.isArray(id) ? Number(id[0]) : 0;
  const branchIdNum =
    typeof branchId === "string"
      ? Number(branchId)
      : Array.isArray(branchId)
      ? Number(branchId[0])
      : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productIdNum || !branchIdNum) {
          setLoading(false);
          return;
        }
        setLoading(true);
        const response = await GetProductDetailByBranch(
          productIdNum,
          branchIdNum
        );
        console.log("response", response);
        const data = response.data?.data;
        if (data) {
          setProduct(data);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productIdNum, branchIdNum]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={{
            color: APP_COLOR.BROWN,
            fontFamily: FONTS.regular,
          }}
        >
          Không tìm thấy sản phẩm.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.WHITE }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.productImage }} style={styles.image} />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.name}>{product.productName}</Text>
          <Text style={styles.price}>
            {product.productPrice.toLocaleString("vi-VN")} đ
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>
              {product.productDescription || "Không có mô tả."}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <AntDesign
                name="inbox"
                size={18}
                color={APP_COLOR.ORANGE}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.infoLabel}>Loại:</Text>
              <Text style={styles.infoValue}>{product.productType}</Text>
            </View>
            {product.calories !== undefined && (
              <View style={styles.infoItem}>
                <AntDesign
                  name="fire"
                  size={18}
                  color={APP_COLOR.ORANGE}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.infoLabel}>Calories:</Text>
                <Text style={styles.infoValue}>
                  {product.calories.toFixed(1)} kcal
                </Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <AntDesign
                name="check-circle"
                size={18}
                color={product.inStock ? "#22c55e" : "#dc2626"}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.infoLabel}>Trạng thái:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: product.inStock ? "#22c55e" : "#dc2626" },
                ]}
              >
                {product.inStock ? "Còn hàng" : "Hết hàng"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: APP_COLOR.WHITE,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  backWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 6,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: APP_COLOR.BROWN,
  },
  productInfo: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: APP_COLOR.BROWN,
    marginTop: 12,
    marginBottom: 4,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: APP_COLOR.ORANGE,
    marginBottom: 16,
  },
  section: {
    marginTop: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginBottom: 6,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    lineHeight: 20,
  },
  infoRow: {
    gap: 8,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: APP_COLOR.BROWN,
    marginRight: 4,
  },
  infoValue: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: APP_COLOR.ORANGE,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});

export default ProductDetail;
