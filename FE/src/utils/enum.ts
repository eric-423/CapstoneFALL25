export enum AuthAction {
  INITIALIZE = 'INITIALIZE',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  PATCH_USER = 'PATCH_USER',
}

export enum CartAction {
  INITIALIZE = 'INITIALIZE',
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  UPDATE_ITEM = 'UPDATE_ITEM',
  CLEAR_CART = 'CLEAR_CART',
  UPDATE_QUANTITY = 'UPDATE_QUANTITY',
  SET_LOADING = 'SET_LOADING',
}

export enum Role {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
  USER = 'CUSTOMER',
}

export enum OrderStatus {
  'PROCESSING' = 'Đang chuẩn bị',
  'IN_DELIVERY' = 'Đang giao hàng',
  'COMPLETED' = 'Đã giao',
  'VERIFIED' = 'Đặt Hàng Thành Công',
  'CANCELLED' = 'Đã hủy',
  'PAID' = 'Đã thanh toán',
  'UNPAID' = 'Chờ Thanh Toán',
}
