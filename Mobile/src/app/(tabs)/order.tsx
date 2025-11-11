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
  useEffect(() => {
    const fetchProductType = async () => {
      const res = await GetProductType();
      setProductType(res.data.data);
    };
    fetchProductType();
  }, []);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND_ORANGE }}
    >
      <HeaderHome pageName="orderPage" />
      <TopListMenu />
      <ModalProvider>
        {productType.map((s) => (
          <CollectionMenu
            key={s.id}
            name={s.name}
            id={s.id}
            branchId={branchId || 0}
          />
        ))}
      </ModalProvider>
    </ScrollView>
  );
};

export default OrderScreen;
