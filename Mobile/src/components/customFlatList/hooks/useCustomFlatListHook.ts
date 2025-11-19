import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

type ICustomFlatListStyles = {
  header: StyleProp<ViewStyle>;
  topElement?: StyleProp<ViewStyle>;
};

type TUseCustomFlatListHook = [
  Animated.Value,
  ICustomFlatListStyles,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void
];

const window = Dimensions.get("window");

export const useCustomFlatListHook = (): TUseCustomFlatListHook => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [heights, setHeights] = useState({
    header: 0,
    topList: 0,
  });

  const styles: ICustomFlatListStyles = {
    header: {
      marginBottom: heights.topList,
    },
    topElement: {
      left: 0,
      marginTop: heights.header,
      position: "absolute",
      right: 0,
      transform: [
        {
          translateY: scrollY.interpolate({
            extrapolate: "clamp",
            inputRange: [-window.height, heights.header + heights.topList],
            outputRange: [window.height, -(heights.header + heights.topList)],
          }),
        },
      ],
      zIndex: 1,
    },
  };

  const onLayoutHeaderElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, header: event.nativeEvent.layout.height });
  };

  const onLayoutTopListElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, topList: event.nativeEvent.layout.height });
  };

  return [scrollY, styles, onLayoutHeaderElement, onLayoutTopListElement];
};
