import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShareButton from "../button/share.button";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import logo from "@/assets/logo.png";
import { useFocusEffect } from "expo-router";
import Toast from "react-native-root-toast";
import footerFrame from "@/assets/frame_footer.png";
import { GetCustomerInformation } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import ItemAddress from "../order/item.address";

interface DecodedToken {
  id?: number;
  fullName: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
}

const UserInfo = () => {
  const [decodeToken, setDecodeToken] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [customerInformation, setCustomerInformation] = useState<any>(null);
  const { appState } = useCurrentApp();
  const getAccessToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      setToken(token);
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodeToken(decoded);
      } else {
        Toast.show("No access token found. Please log in.", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
      }
    } catch (error) {
      console.error("Error retrieving access token:", error);
      Toast.show("Failed to load user information.", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  const fetchCustomerInformation = useCallback(async () => {
    try {
      const res = await GetCustomerInformation(appState?.userInfo?.id || 0);
      setCustomerInformation(res.data.data);
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  }, [appState?.userInfo?.id]);
  useFocusEffect(
    useCallback(() => {
      getAccessToken();
      fetchCustomerInformation();
    }, [getAccessToken, fetchCustomerInformation])
  );

  useEffect(() => {
    fetchCustomerInformation();
  }, [fetchCustomerInformation]);
  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topSection}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Thay đổi thông tin của bạn</Text>
          </View>
          {customerInformation ? (
            customerInformation.map((item: any, index: number) => (
              <ItemAddress
                key={item.id || `address-${index}`}
                cusName={item.fullName}
                cusPhone={item.phone}
                cusAddress={item.address}
                isDefault={item.isDefault}
                informationId={item.informationId}
                onDeleted={fetchCustomerInformation}
              />
            ))
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text
                style={{
                  color: APP_COLOR.BROWN,
                  fontFamily: FONTS.regular,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Chưa có thông tin nào. Vui lòng thêm thông tin mới.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomSection}>
        <Image source={footerFrame} style={styles.footerImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    minHeight: 150,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  logo: {
    height: 150,
    width: 300,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    color: APP_COLOR.BROWN,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
  formContainer: {
    gap: 15,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1000,
  },
  saveButton: {
    backgroundColor: APP_COLOR.BROWN,
    width: "60%",
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: APP_COLOR.BROWN,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: APP_COLOR.WHITE,
    fontSize: 17,
    fontFamily: FONTS.regular,
    textAlign: "center",
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 200,
    height: 200,
    resizeMode: "contain",
    zIndex: 1,
  },
});

export default UserInfo;
