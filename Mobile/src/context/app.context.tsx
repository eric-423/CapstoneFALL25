import { createContext, useContext, useState } from "react";

interface AppContextType {
  theme: string;
  setTheme: (v: string) => void;
  appState: IUserLogin | null;
  setAppState: (v: any) => void;
  cart: ICart | Record<string, never>;
  setCart: (v: any) => void;
  restaurant: IRestaurant | null;
  setRestaurant: (v: any) => void;
  branchId: number | null;
  setBranchId: (v: any) => void;
  selectedProductTypeId: number | null;
  setSelectedProductTypeId: (v: number | null) => void;
  locationReal: string;
  setLocationReal: (v: any) => void;
  branchName: string | null;
  setBranchName: (v: string | null) => void;
  sortDirection: "ASC" | "DESC" | null;
  setSortDirection: (v: "ASC" | "DESC" | null) => void;
}
const AppContext = createContext<AppContextType | null>(null);

interface IProps {
  children: React.ReactNode;
}

const AppProvider = (props: IProps) => {
  const [theme, setTheme] = useState<string>("eric-light");
  const [appState, setAppState] = useState<IUserLogin | null>(null);
  const [cart, setCart] = useState<ICart | Record<string, never>>({});
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [branchId, setBranchId] = useState<number | null>(1);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >(null);
  const [locationReal, setLocationReal] = useState("");
  const [branchName, setBranchName] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC" | null>(
    null
  );
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        appState,
        setAppState,
        cart,
        setCart,
        restaurant,
        setRestaurant,
        branchId,
        setBranchId,
        selectedProductTypeId,
        setSelectedProductTypeId,
        locationReal,
        setLocationReal,
        branchName,
        setBranchName,
        sortDirection,
        setSortDirection,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useCurrentApp = () => {
  const currentTheme = useContext(AppContext);
  if (!currentTheme) {
    throw new Error(
      "useCurrentApp has to be used within <AppContext.Provider>"
    );
  }

  return currentTheme;
};

export default AppProvider;
