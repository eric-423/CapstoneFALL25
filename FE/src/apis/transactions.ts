export interface Transaction {
  paymentCode: string | null;
  amount: number;
  transactionDate: string | null;
  paymentMethod: string;
}

export interface TransactionSearchRequest {
  branchId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface PaginatedTransactionResponse {
  content: Transaction[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export async function getTransactions(
  searchRequest?: TransactionSearchRequest
): Promise<PaginatedTransactionResponse> {
  const params = new URLSearchParams();

  if (searchRequest) {
    if (searchRequest.branchId !== undefined)
      params.append("branchId", searchRequest.branchId.toString());
    if (searchRequest.page !== undefined)
      params.append("page", searchRequest.page.toString());
    if (searchRequest.size !== undefined)
      params.append("size", searchRequest.size.toString());
    if (searchRequest.sortBy) params.append("sortBy", searchRequest.sortBy);
    if (searchRequest.sortDirection)
      params.append("sortDirection", searchRequest.sortDirection);
  }

  const response = await fetch(`/api/transactions?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const result = await response.json();
  if (result.data) {
    return result.data;
  }
  return result;
}
