import ShareInput from "@/components/input/share.input";
import { UpdateUserSchema } from "@/utils/validate.schema";
import { Formik } from "formik";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShareButton from "../button/share.button";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import logo from "@/assets/logo.png";
import { useFocusEffect } from "expo-router";
import Toast from "react-native-root-toast";
import footerFrame from "@/assets/frame_footer.png";
import axios from "axios";

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

  useFocusEffect(
    useCallback(() => {
      getAccessToken();
    }, [getAccessToken])
  );

  // const handleUpdateUser = async (
  //   id: number,
  //   fullName: string,
  //   email: string,
  //   phone_number: string,
  //   date_of_birth: string
  // ) => {
  //   if (!decodeToken) {
  //     Toast.show("User information not available.", {
  //       duration: Toast.durations.LONG,
  //       textColor: "white",
  //       backgroundColor: APP_COLOR.CANCEL,
  //       opacity: 1,
  //     });
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   try {
  //     const response = await axios.put(
  //       `https://wdp301-su25.space/api/profiles/${id}`,
  //       {
  //         fullName,
  //         email,
  //         phone_number,
  //         date_of_birth,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     router.push("/(tabs)/account");
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     Toast.show("Failed to update user information.", {
  //       duration: Toast.durations.LONG,
  //       textColor: "white",
  //       backgroundColor: APP_COLOR.CANCEL,
  //       opacity: 1,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </View>
    );
  }

  // if (!decodeToken) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>No user information available.</Text>
  //     </View>
  //   );
  // }

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

          <Formik
            enableReinitialize
            validationSchema={UpdateUserSchema}
            initialValues={{
              id: decodeToken?.id || 0,
              fullName: decodeToken?.fullName || "",
              phone_number: decodeToken?.phone_number || "",
              email: decodeToken?.email || "",
              date_of_birth: decodeToken?.date_of_birth || "",
            }}
            onSubmit={(values) => {
              // handleUpdateUser(
              //   values.fullName,
              //   values.phoneNumber,
              //   values.email,
              //   values.password,
              //   values.date_of_birth
              // );
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <View style={{ gap: 10 }}>
                  <ShareInput
                    title="Họ và Tên"
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                    error={errors.fullName}
                    touched={touched.fullName}
                  />
                  <ShareInput
                    title="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <ShareInput
                      title="Số điện thoại"
                      onChangeText={handleChange("phone_number")}
                      onBlur={handleBlur("phone_number")}
                      value={values.phone_number}
                      error={errors.phone_number}
                      touched={touched.phone_number}
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <ShareInput
                      title="Ngày sinh"
                      onChangeText={handleChange("date_of_birth")}
                      onBlur={handleBlur("date_of_birth")}
                      value={values.date_of_birth}
                      error={errors.date_of_birth}
                      touched={touched.date_of_birth}
                      isDatePicker
                    />
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.buttonContainer}>
          <ShareButton
            title={"Lưu thay đổi"}
            btnStyle={styles.saveButton}
            textStyle={styles.saveButtonText}
            onPress={() =>
              // handleUpdateUser(
              //   values.id,
              //   values.fullName,
              //   values.email,
              //   values.phone_number,
              //   values.date_of_birth
              // )
              console.log("change pass")
            }
            loading={isSubmitting}
          />
        </View>
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
    paddingHorizontal: 15,
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
