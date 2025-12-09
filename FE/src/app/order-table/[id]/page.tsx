"use client";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import useScrollTop from "@/utils/hooks/useScrollTop";
import {
  ProductType,
  Product,
  getProduct,
  getProductType,
} from "@/apis/product.api";
import { Combo, searchCombos } from "@/apis/combo.api";
import {
  createDiningOrder,
  updateDiningTableOrder,
  DiningOrderRequest,
  UpdateDiningTableOrderRequest,
} from "@/apis/order.api";
import { TableData, getTableById } from "@/apis/table.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Receipt,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import TableProductCard from "../components/table-product-card";
import TableComboCard from "../components/table-combo-card";
import StyledHeading from "@/components/common/styled-heading";
import image from "@/assets/images/Home - Banner.jpg";
import Image from "next/image";

interface CartItem {
  productId: number;
  comboId: number;
  productName: string;
  price: number;
  quantity: number;
  productImage?: string;
  isCombo?: boolean;
  note?: string;
}

export default function OrderTablePage() {
  useScrollTop();
  const params = useParams();
  const tableId = params?.id as string;
  const router = useRouter();

  const [activeCategoryId, setActiveCategoryId] = useState<number>(-1); // -1 = combos
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isLoadingProducts] = useState(false);
  const [isLoadingProductTypes] = useState(false);
  const [isLoadingCombos, setIsLoadingCombos] = useState(false);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [comboList, setComboList] = useState<Combo[]>([]);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const getProductTypeId = (
    p: Product & { productTypeId?: number; productType?: { id?: number } }
  ) => p.productTypeId ?? p.productType?.id ?? 0;

  useEffect(() => {
    const fetchTableData = async () => {
      if (!tableId) return;

      try {
        const data = await getTableById(tableId);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    fetchTableData();
  }, [tableId]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const types = await getProductType();

        setProductTypes(types);
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchProductTypes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!tableData?.branchId) return;

      try {
        const response = await getProduct(
          tableData.branchId,
          "",
          true,
          0,
          999999999,
          0,
          100,
          "name",
          "ASC",
          undefined
        );
        setProductList(response.data.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [tableData?.branchId]);

  useEffect(() => {
    const fetchCombos = async () => {
      if (!tableData?.branchId) return;

      try {
        setIsLoadingCombos(true);
        const response = await searchCombos({
          branchId: tableData.branchId,
          page: 0,
          size: 100,
        });
        setComboList(response.content);
      } catch (error) {
        console.error("Error fetching combos:", error);
      } finally {
        setIsLoadingCombos(false);
      }
    };

    fetchCombos();
  }, [tableData?.branchId]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.productId && !item.isCombo
    );
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === product.productId && !item.isCombo
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: product.productId,
          comboId: 0,
          productName: product.productName,
          price: product.productPrice,
          quantity: 1,
          productImage: product.productImage,
          isCombo: false,
        },
      ]);
    }
  };

  const addComboToCart = (combo: Combo) => {
    const existingItem = cartItems.find(
      (item) => item.comboId === combo.comboId && item.isCombo
    );
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.comboId === combo.comboId && item.isCombo
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: 0,
          comboId: combo.comboId,
          productName: combo.name,
          price: combo.price,
          quantity: 1,
          isCombo: true,
        },
      ]);
    }
  };

  const removeFromCart = (
    productId: number,
    comboId: number,
    isCombo: boolean
  ) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        if (isCombo) {
          return !(item.comboId === comboId && item.isCombo);
        } else {
          return !(item.productId === productId && !item.isCombo);
        }
      })
    );
  };

  const updateQuantity = (
    productId: number,
    comboId: number,
    quantity: number,
    isCombo: boolean
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, comboId, isCombo);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (isCombo) {
          return item.comboId === comboId && item.isCombo
            ? { ...item, quantity }
            : item;
        } else {
          return item.productId === productId && !item.isCombo
            ? { ...item, quantity }
            : item;
        }
      })
    );
  };

  const updateNote = (
    productId: number,
    comboId: number,
    note: string,
    isCombo: boolean
  ) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (isCombo) {
          return item.comboId === comboId && item.isCombo
            ? { ...item, note }
            : item;
        } else {
          return item.productId === productId && !item.isCombo
            ? { ...item, note }
            : item;
        }
      })
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      alert("Vui lòng chọn món ăn!");
      return;
    }

    if (!tableData?.branchId || !tableId) {
      alert("Không tìm thấy thông tin bàn!");
      return;
    }

    try {
      setIsOrderConfirmed(true);
      const hasExistingOrder =
        tableData.currentOrder && tableData.currentOrder.id;

      if (hasExistingOrder) {
        const updateRequest: UpdateDiningTableOrderRequest = {
          diningTableId: parseInt(tableId),
          orderItems: cartItems.map((item) => ({
            productId: item.isCombo ? 0 : item.productId,
            comboId: item.isCombo ? item.comboId : 0,
            quantity: item.quantity,
            price: item.price,
            note: item.note || "",
          })),
        };

        await updateDiningTableOrder(tableData.currentOrder!.id, updateRequest);
      } else {
        const orderRequest: DiningOrderRequest = {
          customerId: tableData.currentOrder?.customerDTO?.id || 0,
          promotionCode: "",
          discountValue: 0,
          shippingAddress: "",
          shippingPhoneNumber: "",
          orderItemList: cartItems.map((item) => ({
            productId: item.isCombo ? 0 : item.productId,
            comboId: item.isCombo ? item.comboId : 0,
            quantity: item.quantity,
            price: item.price,
            note: item.note || "",
          })),
          mode: "DINING",
          diningTableId: parseInt(tableId),
          branchId: tableData.branchId,
        };

        await createDiningOrder(orderRequest);
      }

      const updatedTableData = await getTableById(tableId);
      setTableData(updatedTableData);

      setIsOrderConfirmed(false);
      setShowSuccessScreen(true);
      setCartItems([]);
    } catch (error) {
      console.error("Error creating/updating dining order:", error);
      alert("Có lỗi xảy ra khi đặt món. Vui lòng thử lại!");
      setIsOrderConfirmed(false);
    }
  };

  const handleBackToMenu = () => {
    setShowSuccessScreen(false);
  };

  const scrollToSection = (key: string) => {
    const target = sectionRefs.current[key];
    if (!target) return;
    const headerOffset = 110;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: targetTop - headerOffset, behavior: "smooth" });
    if (key === "combos") {
      setActiveCategoryId(-1);
    } else if (key.startsWith("type-")) {
      const id = Number(key.replace("type-", ""));
      if (!Number.isNaN(id)) setActiveCategoryId(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const entries = Object.entries(sectionRefs.current);
      const offset = 130;
      let currentKey: string | null = null;
      for (const [key, el] of entries) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0 && rect.bottom - offset >= 0) {
          currentKey = key;
          break;
        }
      }
      if (currentKey) {
        if (currentKey === "combos") {
          setActiveCategoryId(-1);
        } else if (currentKey.startsWith("type-")) {
          const id = Number(currentKey.replace("type-", ""));
          if (!Number.isNaN(id)) setActiveCategoryId(id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (comboList.length > 0) {
      setActiveCategoryId(-1);
      return;
    }
    if (productTypes.length > 0) {
      setActiveCategoryId(productTypes[0].id);
    }
  }, [comboList.length, productTypes]);

  if (showSuccessScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Đặt món thành công!
              </h1>
              <p className="text-gray-600">
                Đơn hàng của bạn đã được gửi đến bếp. Vui lòng chờ nhân viên
                phục vụ mang món đến.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-600">
                Thời gian chuẩn bị dự kiến:
              </p>
              <p className="text-lg font-semibold text-primary">15-20 phút</p>
            </div>
            <Button
              onClick={handleBackToMenu}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Tiếp tục đặt món
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <style jsx global>{`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex items-center justify-between p-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">
              {tableData?.name || "Đặt món tại bàn"}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/order-table/${tableId}/ordered-items`)}
            className="p-2 relative"
            disabled={!tableData?.currentOrder?.orderItems?.length}
          >
            <Receipt className="h-6 w-6" />
            {tableData?.currentOrder?.orderItems?.length ? (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {tableData.currentOrder.orderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </Badge>
            ) : null}
          </Button>
        </div>
        <div className="border-t" />
        <div className="overflow-x-auto px-4 py-3 no-scrollbar">
          {isLoadingProductTypes ? (
            <div className="flex items-center justify-center py-2">
              <LoadingSpinner className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex gap-2 min-w-max justify-center">
              <Button
                variant={activeCategoryId === -1 ? "default" : "ghost"}
                className={`shrink-0 transition-all duration-200 hover:scale-105 rounded-none shadow-none ${
                  activeCategoryId === -1
                    ? "bg-white text-orange-500 border-b-2 border-orange-500"
                    : ""
                }`}
                onClick={() => scrollToSection("combos")}
              >
                Combo Ưu Đãi
              </Button>
              {productTypes
                ?.filter((type) => type.name?.trim().toLowerCase() !== "tất cả")
                .map((type) => (
                  <Button
                    key={type.id}
                    variant={activeCategoryId === type.id ? "default" : "ghost"}
                    className={`shrink-0 transition-all duration-200 hover:scale-105 rounded-none shadow-none ${
                      activeCategoryId === type.id
                        ? "bg-white text-orange-500 border-b-2 border-orange-500"
                        : ""
                    }`}
                    onClick={() => scrollToSection(`type-${type.id}`)}
                  >
                    {type.name}
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gray-50 border-r pt-20 z-30">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Danh mục món ăn</h2>
          <div className="space-y-2">
            {/* Combo Button */}
            <Button
              variant={activeCategoryId === -1 ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeCategoryId === -1
                  ? "bg-white text-orange-500 border-b-2 border-orange-500"
                  : ""
              } rounded-none shadow-none`}
              onClick={() => scrollToSection("combos")}
            >
              Combo Ưu Đãi
            </Button>

            <div className="border-t my-3"></div>

            {isLoadingProductTypes ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner className="h-6 w-6" />
              </div>
            ) : (
              productTypes?.map((type) => (
                <Button
                  key={type.id}
                  variant={activeCategoryId === type.id ? "default" : "ghost"}
                  className={`w-full justify-start rounded-none shadow-none ${
                    activeCategoryId === type.id
                      ? "bg-white text-orange-500 border-b-2 border-orange-500"
                      : ""
                  }`}
                  onClick={() => scrollToSection(`type-${type.id}`)}
                >
                  {type.name}
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto lg:pt-0 pb-20 lg:ml-64 max-w-7xl">
        <div className="hidden lg:block fixed top-6 right-6 z-40">
          <Button
            variant="default"
            onClick={() => router.push(`/order-table/${tableId}/ordered-items`)}
            className="gap-2 shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
            disabled={!tableData?.currentOrder?.orderItems?.length}
          >
            <Receipt className="h-5 w-5" />
            Xem món đã đặt
            {tableData?.currentOrder?.orderItems?.length ? (
              <Badge variant="secondary" className="bg-white text-primary">
                {tableData.currentOrder.orderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </Badge>
            ) : null}
          </Button>
        </div>

        <div
          id="hero-section"
          className="relative h-48 sm:h-56 md:h-64 overflow-hidden mb-6"
        >
          <Image
            src={image}
            alt="Đặt món tại bàn"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                <StyledHeading text="Đặt món tại bàn" />
              </h1>
            </div>
          </div>
        </div>

        <div className="lg:mx-4 mx-auto w-[95%]" id="menu-content">
          <div
            className="mt-4"
            ref={(el) => {
              sectionRefs.current["combos"] = el;
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-600">Combo Ưu Đãi</span>
              <Badge className="bg-orange-500 hover:bg-orange-600">Hot</Badge>
            </h2>
            {isLoadingCombos ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner className="my-10 h-8 w-8 animate-spin" />
              </div>
            ) : comboList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {comboList.map((combo) => (
                  <TableComboCard
                    key={combo.comboId}
                    combo={combo}
                    onAddToCart={addComboToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Hiện tại chưa có combo nào</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-8">
            {productTypes
              .filter((type) => type.name?.trim().toLowerCase() !== "tất cả")
              .map((type) => {
                const productsByType = productList.filter((p) => {
                  const pTypeId = getProductTypeId(p);
                  return pTypeId === type.id;
                });
                return (
                  <div
                    key={type.id}
                    ref={(el) => {
                      sectionRefs.current[`type-${type.id}`] = el;
                    }}
                  >
                    <h2 className="text-xl font-bold mb-4">{type.name}</h2>
                    {isLoadingProducts ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner className="my-10 h-8 w-8 animate-spin" />
                      </div>
                    ) : productsByType.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {productsByType.map((product) => (
                          <TableProductCard
                            key={product.productId}
                            product={product}
                            onAddToCart={addToCart}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>Chưa có sản phẩm</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
          <div className="max-w-md mx-auto">
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setIsCartExpanded(!isCartExpanded)}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Thêm Món</span>
                <Badge variant="secondary" className="text-xs">
                  {getTotalItems()}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">
                  {getTotalPrice().toLocaleString()}đ
                </span>
                {isCartExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>

            {isCartExpanded && (
              <div className="border-t bg-gray-50">
                <div className="max-h-64 overflow-y-auto p-3 space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.isCombo ? "combo" : "product"}-${item.isCombo ? item.comboId : item.productId}`}
                      className="bg-white rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">
                            {item.productName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {item.price.toLocaleString()}đ
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.comboId,
                                item.quantity - 1,
                                item.isCombo || false
                              )
                            }
                            className="h-6 w-6 p-0 text-xs"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-xs">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.comboId,
                                item.quantity + 1,
                                item.isCombo || false
                              )
                            }
                            className="h-6 w-6 p-0 text-xs"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Ghi chú (VD: Không cay, nhiều rau...)"
                        value={item.note || ""}
                        onChange={(e) =>
                          updateNote(
                            item.productId,
                            item.comboId,
                            e.target.value,
                            item.isCombo || false
                          )
                        }
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-white border-t">
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={isOrderConfirmed}
                    className="w-full text-sm h-10"
                  >
                    {isOrderConfirmed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Xác nhận thêm món
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
