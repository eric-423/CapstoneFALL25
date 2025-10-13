export const MOCK_ORDERS = [
  {
    id: 1,
    customerId: 3,
    branchId: 1,
    orderDate: "2024-01-15T10:30:00",
    status: "COMPLETED",
    totalAmount: 120000,
    items: [
      { productId: 1, productName: "Phở Bò Đặc Biệt", quantity: 2, price: 65000 },
    ],
    paymentMethod: "CASH",
  },
  {
    id: 2,
    customerId: 3,
    branchId: 1,
    orderDate: "2024-01-16T14:20:00",
    status: "PENDING",
    totalAmount: 105000,
    items: [
      { productId: 2, productName: "Bún Chả Hà Nội", quantity: 1, price: 55000 },
      { productId: 3, productName: "Cơm Tấm Sườn Bì", quantity: 1, price: 50000 },
    ],
    paymentMethod: "VNPAY",
  },
];
