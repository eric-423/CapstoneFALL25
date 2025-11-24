import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const AccountInfoScreen = () => {
  const router = useRouter();
  const { appState } = useCurrentApp();
  const userInfo = appState?.userInfo;

  const infoRows = [
    { label: "Họ và tên", value: userInfo?.fullName || "N/A" },
    { label: "Email", value: userInfo?.email || "N/A" },
    { label: "Số điện thoại", value: userInfo?.phone || "N/A" },
    { label: "Địa chỉ", value: userInfo?.address || "N/A" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={22} color={APP_COLOR.BROWN} />
        </Pressable>
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <MaterialIcons
            name="account-circle"
            size={30}
            color={APP_COLOR.BROWN}
          />
          <Text style={styles.profileName}>
            {userInfo?.fullName || "Shipper"}
          </Text>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          {infoRows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
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
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: APP_COLOR.WHITE,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 20,
    color: APP_COLOR.BROWN,
  },
  profileSubtitle: {
    fontFamily: APP_FONT.MEDIUM,
    color: APP_COLOR.GREY,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: APP_COLOR.WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: APP_FONT.BOLD,
    fontSize: 16,
    color: APP_COLOR.BROWN,
    marginBottom: 12,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: APP_COLOR.GREY + "40",
  },
  rowLabel: {
    fontFamily: APP_FONT.MEDIUM,
    color: APP_COLOR.GREY,
    fontSize: 13,
  },
  rowValue: {
    fontFamily: APP_FONT.BOLD,
    color: APP_COLOR.BROWN,
    fontSize: 15,
    marginTop: 4,
  },
});

export default AccountInfoScreen;
