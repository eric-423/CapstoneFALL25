import * as Yup from "yup";

export const CustomerSignInSchema = Yup.object().shape({
  phoneNumer: Yup.string().required("Số điện thoại không được để trống"),
  password: Yup.string().required("Password không được để trống"),
});
const PHONE_REGEX = /^(0|\+84)(\d){9}$/;
const NAME_REGEX =
  /^(?!\s)(?!.*\s{2,})(?!.*\d)(?!.*[!@#$%^&*()_+=\[\]{};:"\\|,.<>/?`~])[\p{L}\s'.-]{2,50}$/u;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:"'|\\,.<>/?`~])(?!.*\s)[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:"'|\\,.<>/?`~]{8,}$/;
const MIN_AGE = 0;
export const CustomerSignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .matches(NAME_REGEX, "Tên chỉ được chứa chữ cái và tối thiểu 2 ký tự")
    .required("Tên không được để trống"),
  phoneNumber: Yup.string()
    .matches(
      PHONE_REGEX,
      "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0 hoặc +84)"
    )
    .required("Số điện thoại không được để trống"),
  dateOfBirth: Yup.string()
    .required("Ngày sinh không được để trống")
    .test("is-valid-date", "Ngày sinh không hợp lệ", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("age-check", `Bạn phải trên ${MIN_AGE} tuổi`, (value) => {
      if (!value) return false;
      const date = new Date(value);
      if (isNaN(date.getTime())) return false;
      const today = new Date();
      const age =
        today.getFullYear() -
        date.getFullYear() -
        (today.getMonth() < date.getMonth() ||
        (today.getMonth() === date.getMonth() &&
          today.getDate() < date.getDate())
          ? 1
          : 0);
      return age >= MIN_AGE;
    })
    .test(
      "not-in-future",
      "Ngày sinh không được lớn hơn ngày hiện tại",
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;
        return date <= new Date();
      }
    ),
  password: Yup.string()
    .matches(
      PASSWORD_REGEX,
      "Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    .required("Mật khẩu không được để trống"),
  confirmPassword: Yup.string()
    .required("Xác nhận mật khẩu không được để trống")
    .oneOf([Yup.ref("password")], "Không trùng với mật khẩu"),
});
export const UpdateUserSchema = Yup.object().shape({
  name: Yup.string().required("Họ tên không được để trống"),
  phone: Yup.string().required("Số điện thoại không được để trống"),
});
export const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password cần tối thiểu 6 kí tự")
    .max(50, "Password tối đa 50 ký tự")
    .matches(/[0-9]/, "Password phải chứa ít nhất một chữ số")
    .matches(/[^a-zA-Z0-9]/, "Password phải chứa ít nhất một ký tự đặc biệt")
    .required("Password không được để trống"),
  cofirmPassword: Yup.string()
    .min(6, "Password cần tối thiểu 6 kí tự")
    .max(50, "Password tối đa 50 ký tự")
    .matches(/[0-9]/, "Password phải chứa ít nhất một chữ số")
    .matches(/[^a-zA-Z0-9]/, "Password phải chứa ít nhất một ký tự đặc biệt")
    .required("Password không được để trống")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});
export const UpdateUserPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Mật khẩu mới cần tối thiểu 6 ký tự")
    .max(50, "Mật khẩu mới tối đa 50 ký tự")
    .required("Mật khẩu mới không được để trống"),
  confirmNewPassword: Yup.string()
    .required("Mật khẩu xác nhận không được để trống")
    .oneOf([Yup.ref("newPassword")], "Không trùng với mật khẩu"),
});
