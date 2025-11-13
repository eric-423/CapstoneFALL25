declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.jpeg" {
  const value: any;
  export default value;
}

declare module "*.gif" {
  const value: any;
  export default value;
}

declare module "*.svg" {
  const value: any;
  export default value;
}

declare module "*.ttf" {
  const value: any;
  export default value;
}

declare module "react-native-check-box" {
  import { Component } from "react";
  import { ViewStyle } from "react-native";

  interface CheckBoxProps {
    style?: ViewStyle;
    onClick?: () => void;
    isChecked?: boolean;
    checked?: boolean;
    leftText?: string;
    leftTextView?: React.ReactNode;
    rightText?: string;
    rightTextView?: React.ReactNode;
    checkedImage?: React.ReactNode;
    unCheckedImage?: React.ReactNode;
    disabled?: boolean;
  }

  export default class CheckBox extends Component<CheckBoxProps> {}
}
