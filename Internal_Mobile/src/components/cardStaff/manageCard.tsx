import { APP_COLOR } from "@/constants/Colors";
import { FONTS } from "@/themes/typography";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
const ManageCard = () => {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: APP_COLOR.WHITE,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: APP_COLOR.GREY,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONTS.bold,
            color: APP_COLOR.BROWN,
          }}
        >
          Vận hành
        </Text>
        <AntDesign name="doubleright" size={20} color={APP_COLOR.ORANGE} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          gap: 10,
          justifyContent: "space-around",
        }}
      >
        <View style={styles.textSection}>
          <Text style={styles.boldText}>0 ĐH</Text>
          <Text style={styles.text}>Đã lấy</Text>
        </View>
        <View style={styles.textSection}>
          <Text style={styles.boldText}>0 ĐH</Text>
          <Text style={styles.text}>Đã giao</Text>
        </View>
        <View
          style={{
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: APP_COLOR.GREY,
            overflow: "hidden",
          }}
        >
          <LineChart
            data={{
              labels: ["", "", "", "", "", "", ""],
              datasets: [
                {
                  data: [
                    0, 5, 8, 12, 15, 10, 18, 20, 1, 4, 5, 10, 4, 2, 3, 5, 7, 2,
                  ],
                  color: (opacity = 1) => APP_COLOR.ORANGE,
                  strokeWidth: 2,
                },
              ],
            }}
            width={200}
            height={60}
            chartConfig={{
              backgroundColor: APP_COLOR.WHITE,
              backgroundGradientFrom: APP_COLOR.WHITE,
              backgroundGradientTo: APP_COLOR.WHITE,
              decimalPlaces: 0,
              color: (opacity = 1) => APP_COLOR.ORANGE,
              labelColor: (opacity = 1) => "transparent",
              formatXLabel: () => "",
              formatYLabel: () => "",
            }}
            bezier
            style={{
              marginLeft: -50,
              marginRight: -20,
            }}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={false}
            withDots={false}
            withShadow={false}
            fromZero={false}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.regular,
  },
  textSection: { flexDirection: "column", gap: 10, alignItems: "center" },
  boldText: {
    fontSize: 16,
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.bold,
  },
});
export default ManageCard;
