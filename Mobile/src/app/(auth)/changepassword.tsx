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
import { router, useLocalSearchParams } from "expo-router";
import { ChangePassword } from "@/utils/api";
const ChangePasswordPage = () => {
  const formikRef = useRef<FormikProps<any>>(null);
  const { phoneNumber, inputOtp } = useLocalSearchParams();
  const handleUpdatePassword = async (newPassword: string) => {
    try {
      console.log(inputOtp, phoneNumber, newPassword);
      const res = await ChangePassword(
        inputOtp as string,
        phoneNumber as string,
        newPassword
      );
      console.log("Change password response:", res);
      if (res?.data || res?.status === 200) {
        Toast.show("Thay đổi mật khẩu thành công", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
        });
        router.replace("/(auth)/welcome");
      }
    } catch (error: any) {
      console.log("Change password error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Thay đổi mật khẩu thất bại. Vui lòng thử lại.";
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
        newPassword: "",
        confirmNewPassword: "",
      }}
      onSubmit={(values) => handleUpdatePassword(values?.newPassword ?? "")}
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
                  {isValid && dirty
                    ? "Thay đổi mật khẩu"
                    : "Không thể thay đổi"}
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

export default ChangePasswordPage;
