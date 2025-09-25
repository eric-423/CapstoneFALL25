export const USER_MESSAGES = {
  FULLNAME_MESSAGE: 'Please enter at least 1 character',
  EMAIL_MESSAGE: 'Please enter a valid email',
  PASSWORD_MESSAGE:
    'Password must be between 8 and 16 characters, including one number, one uppercase letter, and one lowercase letter',
  PHONE_MESSAGE: 'Vui lòng nhập số điện thoại hợp lệ',
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
} as const;

export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

export const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const AUTH_FORM_FIELDS = {
  phoneNumber: {
    label: 'Số điện thoại',
    name: 'phoneNumber',
    type: 'text',
    placeholder: 'Nhập số điện thoại của bạn',
    control: {
      required: true,
      pattern: PHONE_REGEX,
    },
    errorMessage: 'Số điện thoại không hợp lệ',
  },
  password: {
    label: 'Mật khẩu',
    name: 'password',
    type: 'password',
    placeholder: 'Nhập mật khẩu của bạn',
    control: {
      required: true,
      minLength: 6,
    },
    errorMessage: 'Mật khẩu phải có ít nhất 6 ký tự',
  },
  confirmPassword: {
    label: 'Xác nhận mật khẩu',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Nhập lại mật khẩu của bạn',
    control: {
      required: true,
      minLength: 6,
    },
    errorMessage: 'Mật khẩu không khớp',
  },
  otp: {
    label: 'Mã xác thực',
    name: 'otp',
    type: 'text',
    placeholder: 'Nhập mã xác thực',
    control: {
      required: true,
    },
    errorMessage: 'Mã xác thực không hợp lệ',
  },
};
