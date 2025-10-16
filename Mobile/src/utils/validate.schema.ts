import * as Yup from "yup";

export const CustomerSignInSchema = Yup.object().shape({
  email: Yup.string().required("Email không được để trống"),
  password: Yup.string().required("Password không được để trống"),
});
export const CustomerSignUpSchema = Yup.object().shape({
  fullName: Yup.string().required("Tên không được để trống "),
  phoneNumber: Yup.string().required("Số điện thoại không được để trống"),
  email: Yup.string().required("Email không được để trống"),
  date_of_birth: Yup.string().required("Ngày sinh không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
  confirmPassword: Yup.string()
    .required("Xác nhận mật khẩu không được để trống")
    .oneOf([Yup.ref("password")], "Không trùng với mật khẩu"),
});
