import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { APP_COLOR } from "@/utils/constant";
import HeaderHome from "@/components/home/header.home";
import TopListMenu from "@/components/menu/top.list.menu";
import CollectionMenu, {
  ModalProvider,
} from "@/components/menu/collection.menu";
import { useCurrentApp } from "@/context/app.context";
import { GetProductType } from "@/utils/api";
interface IProductType {
  id: number;
  name: string;
}
const OrderScreen = () => {
  const { branchId } = useCurrentApp();
  const [productType, setProductType] = useState<IProductType[]>([]);
  const [activeTab, setActiveTab] = useState<"Danh mục" | "Combo">("Danh mục");
  useEffect(() => {
    const fetchProductType = async () => {
      const res = await GetProductType();
      setProductType(res.data.data);
    };
    fetchProductType();
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}
    >
      <HeaderHome pageName="orderPage" />
      <TopListMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <ModalProvider>
        {activeTab === "Danh mục" ? (
          productType.map((s) => (
            <CollectionMenu
              key={s.id}
              name={s.name}
              id={s.id}
              branchId={branchId || 0}
            />
          ))
        ) : (
          <CollectionMenu branchId={branchId || 0} part="combo" name="Combo" />
        )}
      </ModalProvider>
    </ScrollView>
  );
};

export default OrderScreen;
