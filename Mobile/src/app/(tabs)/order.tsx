import React from "react";
import { ScrollView, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import HeaderHome from "@/components/home/header.home";
import TopListMenu from "@/components/menu/top.list.menu";
import CollectionMenu, {
  ModalProvider,
} from "@/components/menu/collection.menu";
import { useCurrentApp } from "@/context/app.context";

const MENU_SECTIONS = [
  { name: "Món ăn được yêu thích", id: 1 },
  { name: "Đồ uống giải khát", id: 2 },
  { name: "Món thêm hấp dẫn", id: 3 },
];

const OrderScreen = () => {
  const { branchId } = useCurrentApp();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}
    >
      <HeaderHome pageName="orderPage" />
      <TopListMenu />
      <ModalProvider>
        {MENU_SECTIONS.map((s) => (
          <CollectionMenu
            key={s.id}
            name={s.name}
            id={s.id}
            branchId={branchId}
          />
        ))}
      </ModalProvider>
    </ScrollView>
  );
};

export default OrderScreen;
