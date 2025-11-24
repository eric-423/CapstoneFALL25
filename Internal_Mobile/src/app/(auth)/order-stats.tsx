import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

type RangeType = "week" | "month" | "quarter";

const OrderStatsScreen = () => {
  const router = useRouter();
  const [range, setRange] = useState<RangeType>("month");
  const orderStats = useMemo(() => {
    const lengthMap = {
      week: 4,
      month: 6,
      quarter: 4,
    } as const;

    return Array.from({ length: lengthMap[range] }, (_, index) => {
      const label =
        range === "week"
          ? `Tuần ${index + 1}`
          : range === "quarter"
          ? `Q${index + 1}`
          : `T${index + 1}`;
      const total = 100 + Math.round(Math.random() * 50);
      const completed = Math.round(total * (0.85 + Math.random() * 0.08));
      const inProgress = Math.max(0, Math.round((total - completed) * 0.5));
      const canceled = total - completed - inProgress;
      const successRate = Math.round((completed / total) * 100);
      return {
        label,
        total,
        completed,
        inProgress,
        canceled,
        successRate,
      };
    });
  }, [range]);

  const chartData = useMemo(
    () => ({
      labels: orderStats.map((item) => item.label),
      datasets: [
        {
          data: orderStats.map((item) => item.completed),
          color: () => APP_COLOR.ORANGE,
          strokeWidth: 2,
        },
        {
          data: orderStats.map((item) => item.inProgress),
          color: () => APP_COLOR.SOFT_BLUE,
          strokeWidth: 2,
        },
      ],
      legend: ["Đã giao", "Đang giao"],
    }),
    [orderStats]
  );

  const summary = useMemo(() => {
    const total = orderStats.reduce((sum, item) => sum + item.total, 0);
    const completed = orderStats.reduce((sum, item) => sum + item.completed, 0);
    const inProgress = orderStats.reduce(
      (sum, item) => sum + item.inProgress,
      0
    );
    const canceled = orderStats.reduce((sum, item) => sum + item.canceled, 0);
    const successRate = total ? Math.round((completed / total) * 100) : 0;
    return {
      total,
      completed,
      inProgress,
      canceled,
      successRate,
    };
  }, [orderStats]);

  const filterOptions: { label: string; value: RangeType }[] = [
    { label: "Theo tuần", value: "week" },
    { label: "Theo tháng", value: "month" },
    { label: "Theo quý", value: "quarter" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={22} color={APP_COLOR.BROWN} />
        </Pressable>
        <Text style={styles.headerTitle}>Thống kê đơn hàng</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.filterRow}>
          {filterOptions.map((option) => {
            const isActive = range === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setRange(option.value)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: "#FFF3E7" }]}>
            <Text style={styles.summaryLabel}>Tổng đơn</Text>
            <Text style={styles.summaryValue}>
              {summary.total.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#F4FFF2" }]}>
            <Text style={styles.summaryLabel}>Tỷ lệ giao thành công</Text>
            <Text style={styles.summaryValue}>{summary.successRate}%</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: "#E8F5FF" }]}>
            <Text style={styles.summaryLabel}>Đang giao</Text>
            <Text style={styles.summaryValue}>
              {summary.inProgress.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#FFECEC" }]}>
            <Text style={styles.summaryLabel}>Huỷ/Giao lỗi</Text>
            <Text style={styles.summaryValue}>
              {summary.canceled.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Tiến độ theo {range}</Text>
          <LineChart
            data={chartData}
            width={320}
            height={220}
            chartConfig={{
              backgroundColor: APP_COLOR.WHITE,
              backgroundGradientFrom: APP_COLOR.WHITE,
              backgroundGradientTo: APP_COLOR.WHITE,
              decimalPlaces: 0,
              color: () => APP_COLOR.BROWN,
              labelColor: () => APP_COLOR.GREY,
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: APP_COLOR.ORANGE,
              },
            }}
            withInnerLines={false}
            withShadow={false}
            bezier
            style={{ marginTop: 8 }}
          />
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Chi tiết {range}</Text>
          {orderStats.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.subText}>
                  Tổng: {item.total.toLocaleString()} đơn
                </Text>
                <Text style={styles.subText}>
                  Đã giao: {item.completed.toLocaleString()} đơn
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.netValue, { color: APP_COLOR.SOFT_BLUE }]}>
                  Đang giao: {item.inProgress.toLocaleString()}
                </Text>
                <Text style={[styles.codText, { color: APP_COLOR.CANCEL }]}>
                  Huỷ: {item.canceled.toLocaleString()}
                </Text>
                <Text style={styles.successText}>
                  Tỷ lệ: {item.successRate}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: APP_COLOR.BROWN,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: APP_COLOR.BROWN,
    fontFamily: APP_FONT.BOLD,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: APP_COLOR.GREY + "70",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: APP_COLOR.ORANGE,
    borderColor: APP_COLOR.ORANGE,
  },
  filterText: {
    fontFamily: APP_FONT.MEDIUM,
    color: APP_COLOR.BROWN,
    fontSize: 13,
  },
  filterTextActive: {
    color: APP_COLOR.WHITE,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
  },
  summaryLabel: {
    fontFamily: APP_FONT.MEDIUM,
    color: APP_COLOR.BROWN,
    fontSize: 13,
  },
  summaryValue: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 20,
    color: APP_COLOR.BROWN,
    marginTop: 6,
  },
  chartCard: {
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: APP_COLOR.BROWN,
    fontFamily: APP_FONT.BOLD,
  },
  listCard: {
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: APP_COLOR.GREY + "40",
    paddingBottom: 12,
  },
  rowLabel: {
    fontFamily: APP_FONT.BOLD,
    color: APP_COLOR.BROWN,
    fontSize: 15,
    marginBottom: 4,
  },
  subText: {
    fontFamily: APP_FONT.REGULAR,
    color: APP_COLOR.GREY,
    fontSize: 13,
  },
  rowRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
  },
  netValue: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 14,
  },
  codText: {
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 13,
  },
  successText: {
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 13,
    color: APP_COLOR.DONE,
  },
});

export default OrderStatsScreen;
