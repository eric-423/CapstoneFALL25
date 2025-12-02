import { APP_COLOR } from "@/utils/constant";
import { Pressable, Text, View } from "react-native";
import CusInfoText from "./user.info.text";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { FONTS } from "@/theme/typography";
interface ICustomerPointProps {
  fullName: string;
  phoneNumber: string;
  memberPoint: number;
}
const CustomerPoint = (props: ICustomerPointProps) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: APP_COLOR.BROWN,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <View style={{ width: "70%", justifyContent: "center" }}>
        <CusInfoText
          title="Họ và tên"
          info={props.fullName ? props.fullName : "Chưa có thông tin"}
        />
        <CusInfoText
          title="SĐT"
          info={props.phoneNumber ? props.phoneNumber : "Chưa có thông tin"}
        />
      </View>
      <Pressable
        onPress={() => console.log("scan")}
        style={{
          padding: 10,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EvilIcons name="user" size={40} color={APP_COLOR.WHITE} />
        <View
          style={{
            borderWidth: 0.5,
            borderColor: APP_COLOR.WHITE,
            borderRadius: 7,
            paddingHorizontal: 5,
            paddingVertical: 2,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: APP_COLOR.WHITE,
              fontFamily: FONTS.regular,
              fontSize: 13,
            }}
          >
            {" "}
            Đổi {props.memberPoint} điểm
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
export default CustomerPoint;
