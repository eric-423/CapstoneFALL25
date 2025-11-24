import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

type RangeType = "week" | "month" | "quarter";

const FinanceOverviewScreen = () => {
  const router = useRouter();
  const [range, setRange] = useState<RangeType>("month");
  const financeStats = useMemo(() => {
    const seed = {
      week: 4,
      month: 6,
      quarter: 4,
    }[range];

    return Array.from({ length: seed }, (_, index) => {
      const label =
        range === "week"
          ? `Tuần ${index + 1}`
          : range === "quarter"
          ? `Q${index + 1}`
          : `T${index + 1}`;
      const revenue = 400 + Math.round(Math.random() * 120);
      const expense = 140 + Math.round(Math.random() * 60);
      const cod = 250 + Math.round(Math.random() * 90);
      return {
        label,
        revenue,
        expense,
        cod,
        net: revenue - expense,
      };
    });
  }, [range]);

  const chartData = useMemo(
    () => ({
      labels: financeStats.map((item) => item.label),
      datasets: [
        {
          data: financeStats.map((item) => item.revenue),
          color: () => APP_COLOR.ORANGE,
          strokeWidth: 2,
        },
        {
          data: financeStats.map((item) => item.expense),
          color: () => APP_COLOR.CANCEL,
          strokeWidth: 2,
        },
      ],
      legend: ["Doanh thu", "Chi phí"],
    }),
    [financeStats]
  );

  const summary = useMemo(() => {
    const revenue = financeStats.reduce((sum, item) => sum + item.revenue, 0);
    const expense = financeStats.reduce((sum, item) => sum + item.expense, 0);
    const cod = financeStats.reduce((sum, item) => sum + item.cod, 0);
    return {
      revenue,
      expense,
      cod,
      net: revenue - expense,
    };
  }, [financeStats]);

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
        <Text style={styles.headerTitle}>Quản lý dòng tiền</Text>
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
            <Text style={styles.summaryLabel}>Doanh thu</Text>
            <Text style={styles.summaryValue}>
              {summary.revenue.toLocaleString()}K
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#FFECEC" }]}>
            <Text style={styles.summaryLabel}>Chi phí</Text>
            <Text style={styles.summaryValue}>
              {summary.expense.toLocaleString()}K
            </Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: "#E8F5FF" }]}>
            <Text style={styles.summaryLabel}>COD thu hộ</Text>
            <Text style={styles.summaryValue}>
              {summary.cod.toLocaleString()}K
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: "#F4FFF2" }]}>
            <Text style={styles.summaryLabel}>Lợi nhuận</Text>
            <Text style={styles.summaryValue}>
              {summary.net.toLocaleString()}K
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Dòng tiền - {range}</Text>
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
          {financeStats.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.subText}>
                  Doanh thu: {item.revenue.toLocaleString()}K
                </Text>
                <Text style={styles.subText}>
                  Chi phí: {item.expense.toLocaleString()}K
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Text
                  style={[
                    styles.netValue,
                    {
                      color: item.net >= 0 ? APP_COLOR.DONE : APP_COLOR.CANCEL,
                    },
                  ]}
                >
                  {item.net >= 0 ? "+" : ""}
                  {item.net.toLocaleString()}K
                </Text>
                <Text style={styles.codText}>
                  COD: {item.cod.toLocaleString()}K
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
    fontSize: 16,
  },
  codText: {
    fontFamily: APP_FONT.MEDIUM,
    fontSize: 13,
    color: APP_COLOR.SOFT_BLUE,
  },
});

export default FinanceOverviewScreen;
