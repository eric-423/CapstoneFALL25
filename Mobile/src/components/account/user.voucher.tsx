import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
interface IVoucher {
  code: string;
  description: string;
  date: string;
  promotionId?: string | number;
  name?: string;
  fullDescription?: string;
  discountAmount?: number;
  minOrderAmount?: number;
  usageCount?: number;
  maxNumberOfUses?: number;
  isActive?: boolean;
  promotionTypeName?: string;
  endDateRaw?: string;
}
const VoucherComponent = (props: IVoucher) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 7,
        borderStyle: "dashed",
      }}
    >
      <View
        style={{
          backgroundColor: APP_COLOR.WHITE,
          paddingVertical: 10,
          flex: 0.7,
          borderRadius: 7,
          borderLeftColor: APP_COLOR.BROWN,
          borderLeftWidth: 3,
        }}
      >
        <Text
          style={{
            color: APP_COLOR.BROWN,
            fontFamily: FONTS.bold,
            marginLeft: 5,
          }}
        >
          {props.code}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 15,
            color: APP_COLOR.BROWN,
            marginLeft: 10,
          }}
        >
          HSD: <Text style={{ fontFamily: FONTS.bold }}>{props.date}</Text>
        </Text>

        <Text
          style={{
            color: APP_COLOR.BROWN,
            marginLeft: 10,
            fontFamily: FONTS.regular,
          }}
        >
          {props.description}
        </Text>
      </View>
      <View
        style={{
          borderRightWidth: 1,
          borderRightColor: APP_COLOR.BROWN,
          borderStyle: "dashed",
        }}
      ></View>
      <View
        style={{
          backgroundColor: APP_COLOR.WHITE,
          flex: 0.3,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={() => {
            if (props.promotionId) {
              router.push({
                pathname: "/(user)/voucher/[id]",
                params: {
                  id: props.promotionId.toString(),
                  name: props.name || props.code,
                  code: props.code,
                  description: props.fullDescription || props.description,
                  discountAmount: props.discountAmount?.toString() || "0",
                  minOrderAmount: props.minOrderAmount?.toString() || "0",
                  usageCount: props.usageCount?.toString() || "0",
                  maxNumberOfUses: props.maxNumberOfUses?.toString() || "1",
                  isActive: props.isActive?.toString() || "true",
                  endDate: props.endDateRaw || props.date,
                  promotionTypeName: props.promotionTypeName || "",
                },
              });
            }
          }}
        >
          <Text
            style={{
              textDecorationLine: "underline",
              color: APP_COLOR.ORANGE,
              fontFamily: FONTS.regular,
            }}
          >
            Xem chi tiết
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export default VoucherComponent;
