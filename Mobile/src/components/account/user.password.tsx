import ShareInput from "@/components/input/share.input";
import { FONTS } from "@/theme/typography";
import { APP_COLOR } from "@/utils/constant";
import { UpdateUserPasswordSchema } from "@/utils/validate.schema";
import { Formik, FormikProps } from "formik";
import { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import Toast from "react-native-root-toast";
import logo from "@/assets/logo.png";
import footerFrame from "@/assets/frame_footer.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const UserPassword = () => {
  const formikRef = useRef<FormikProps<any>>(null);
  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Toast.show("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
        return;
      }
    } catch (error) {
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
        } else if (error.response?.data?.message) {
          errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : error.response.data.message;
        }
      }

      Toast.show(errorMessage, {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    }
  };
  return (
    <Formik
      innerRef={formikRef}
      validationSchema={UpdateUserPasswordSchema}
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }}
      onSubmit={(values) =>
        handleUpdatePassword(
          values?.currentPassword ?? "",
          values?.newPassword ?? ""
        )
      }
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
        dirty,
      }) => (
        <View style={styles.mainContainer}>
          <View style={styles.topSection}>
            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.headerContainer}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>Thay đổi mật khẩu của bạn</Text>
              </View>

              <View style={styles.formContainer}>
                <ShareInput
                  title="Mật khẩu hiện tại"
                  secureTextEntry={true}
                  onChangeText={handleChange("currentPassword")}
                  onBlur={handleBlur("currentPassword")}
                  value={values.currentPassword}
                  error={errors.currentPassword}
                  touched={touched.currentPassword}
                />

                <ShareInput
                  title="Mật khẩu mới"
                  secureTextEntry={true}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                />

                <ShareInput
                  title="Xác nhận mật khẩu mới"
                  secureTextEntry={true}
                  onChangeText={handleChange("confirmNewPassword")}
                  onBlur={handleBlur("confirmNewPassword")}
                  value={values.confirmNewPassword}
                  error={errors.confirmNewPassword}
                  touched={touched.confirmNewPassword}
                />
              </View>
            </ScrollView>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.buttonContainer}>
              <Pressable
                disabled={!(isValid && dirty)}
                onPress={handleSubmit as any}
                style={[
                  styles.saveButton,
                  {
                    backgroundColor:
                      isValid && dirty ? APP_COLOR.BROWN : APP_COLOR.GRAY,
                  },
                ]}
              >
                <Text style={styles.saveButtonText}>
                  {isValid && dirty ? "Lưu thay đổi" : "Lưu thay đổi"}
                </Text>
              </Pressable>
            </View>
            <Image source={footerFrame} style={styles.footerImage} />
          </View>
        </View>
      )}
    </Formik>
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
    paddingBottom: 50,
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
    gap: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1000,
  },
  saveButton: {
    width: "60%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    textAlign: "center",
    color: APP_COLOR.WHITE,
    fontFamily: FONTS.regular,
    fontSize: 15,
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

export default UserPassword;
