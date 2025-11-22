export interface ErrorResponse<T> {
  data?: T;
  message: string;
  statusCode: number;
}

export interface SuccessResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
