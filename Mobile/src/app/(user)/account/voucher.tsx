import { useEffect, useState } from "react";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { StyleSheet, Text, View, SectionList } from "react-native";
import VoucherComponent from "@/components/account/user.voucher";
import CustomerPoint from "@/components/account/user.point";
import { getCustomerPromotion } from "@/utils/api";
import Toast from "react-native-root-toast";
import { useCurrentApp } from "@/context/app.context";
const Voucher = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [groupedVouchers, setGroupedVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { appState } = useCurrentApp();

  const formatDiscountDescription = (
    promotionTypeName: string,
    value: number
  ) => {
    if (promotionTypeName === "Giảm giá theo %") {
      return `Giảm ${value}%`;
    } else if (promotionTypeName === "Giảm giá cố định") {
      return `Giảm ${value.toLocaleString("vi-VN")}đ`;
    } else if (promotionTypeName === "Miễn phí vận chuyển") {
      return "Miễn phí vận chuyển";
    }
    return `Giảm ${value.toLocaleString("vi-VN")}đ`;
  };

  const groupVouchersByType = (voucherList: any[]) => {
    const grouped = voucherList.reduce((acc: any, voucher) => {
      const type = voucher.type || "Khác";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(voucher);
      return acc;
    }, {});
    return Object.keys(grouped).map((type) => ({
      title: type,
      data: grouped[type],
    }));
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setIsLoading(true);
        const response = await getCustomerPromotion();
        if (response.data && response.data.status === 0 && response.data.data) {
          const mappedVouchers = response.data.data.map((promotion: any) => ({
            promotionId: promotion.id,
            type: promotion.promotionTypeName || "Khác",
            name: promotion.name,
            code: promotion.name,
            discountAmount: promotion.value,
            endDate: promotion.endDate,
            description: promotion.description,
            minimumOrderValue: promotion.minimumOrderValue,
            userPromotionStatus: promotion.userPromotionStatus,
            usageCount: promotion.usageCount,
            promotionTypeName: promotion.promotionTypeName,
          }));
          const availableVouchers = mappedVouchers.filter(
            (v: any) => v.userPromotionStatus === "AVAILABLE"
          );

          setVouchers(availableVouchers);
          setGroupedVouchers(groupVouchersByType(availableVouchers));
        } else {
          setVouchers([]);
          setGroupedVouchers([]);
        }
      } catch (error: any) {
        console.error("Error fetching vouchers:", error);
        setVouchers([]);
        setGroupedVouchers([]);
        Toast.show(error?.response?.data?.desc || "Không thể tải mã ưu đãi", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVouchers();
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        <CustomerPoint
          fullName={appState?.userInfo?.fullName || ""}
          phoneNumber={appState?.userInfo?.phoneNumber || ""}
          memberPoint={appState?.userInfo?.memberPoint || 0}
        />
      </View>
      {!appState?.userInfo?.id ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: FONTS.medium,
              color: APP_COLOR.BROWN,
              textAlign: "center",
            }}
          >
            Hãy đăng nhập để nhận ưu đãi
          </Text>
        </View>
      ) : (
        <>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải mã ưu đãi...</Text>
            </View>
          ) : vouchers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bạn chưa có mã ưu đãi nào</Text>
              <Text style={styles.emptySubText}>
                Hãy mua sắm để nhận được các mã ưu đãi hấp dẫn!
              </Text>
            </View>
          ) : (
            <SectionList
              sections={groupedVouchers}
              renderItem={({ item }) => (
                <VoucherComponent
                  code={item.name}
                  name={item.name}
                  description={formatDiscountDescription(
                    item.promotionTypeName,
                    item.discountAmount
                  )}
                  fullDescription={item.description}
                  date={
                    item.endDate
                      ? new Date(item.endDate).toLocaleDateString("vi-VN")
                      : ""
                  }
                  promotionId={item.promotionId}
                  discountAmount={item.discountAmount}
                  minOrderAmount={item.minimumOrderValue}
                  usageCount={item.usageCount}
                  maxNumberOfUses={item.usageCount || 1}
                  isActive={item.userPromotionStatus === "AVAILABLE"}
                  promotionTypeName={item.promotionTypeName}
                  endDateRaw={item.endDate}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{title}</Text>
                  <View style={styles.sectionLine} />
                </View>
              )}
              keyExtractor={(item) => item.promotionId?.toString() || item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              stickySectionHeadersEnabled={false}
            />
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  text: {
    alignSelf: "center",
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: APP_COLOR.BROWN,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: APP_COLOR.BROWN,
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: APP_COLOR.GRAY,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 10,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    marginBottom: 8,
  },
  sectionLine: {
    height: 2,
    backgroundColor: APP_COLOR.ORANGE,
    borderRadius: 1,
    width: "30%",
  },
});
export default Voucher;
