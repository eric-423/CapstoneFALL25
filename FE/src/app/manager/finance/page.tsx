"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  DollarSign,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ManagerGuard } from "@/components/guards";

import { Card } from "@/components/ui/card";
import {
  getTransactions,
  type Transaction,
  type PaginatedTransactionResponse,
} from "@/apis/transactions";
import { getCookie } from "@/utils/cookies.client";
import {
  AdminPageHeader,
  AdminPageLayout,
} from "../components/AdminPageLayout";
import { AdminCard } from "../components/AdminCard";

const PAGE_SIZE = 10;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Chưa có";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Không hợp lệ";
  }
};

const getPaymentMethodBadgeClass = (method: string): string => {
  const methodMap: Record<string, string> = {
    PayOS: "bg-blue-100 text-blue-700 border-blue-200",
    "Tiền mặt": "bg-green-100 text-green-700 border-green-200",
    "Chuyển khoản": "bg-purple-100 text-purple-700 border-purple-200",
  };
  return methodMap[method] || "bg-gray-100 text-gray-700 border-gray-200";
};

export default function FinancePage() {
  const [branchId, setBranchId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("transactionDate");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    const branchIdFromCookie = getCookie("branchId");
    if (branchIdFromCookie) {
      setBranchId(parseInt(branchIdFromCookie));
    } else {
      toast.error("Không tìm thấy branchId trong cookie!");
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!branchId) return;

    try {
      setLoading(true);
      const response: PaginatedTransactionResponse = await getTransactions({
        branchId,
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      });

      setTransactions(response.content || []);
      setTotalElements(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("fetchTransactions error:", error);
      toast.error("Không thể tải danh sách giao dịch!");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [branchId, currentPage, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    if (branchId) {
      fetchTransactions();
    }
  }, [branchId, fetchTransactions]);

  // Filter transactions (client-side filtering for search and payment method)
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by search keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.paymentCode?.toLowerCase().includes(keyword) ||
          t.paymentMethod?.toLowerCase().includes(keyword) ||
          t.amount.toString().includes(keyword)
      );
    }

    // Filter by payment method
    if (paymentMethodFilter) {
      filtered = filtered.filter(
        (t) => t.paymentMethod === paymentMethodFilter
      );
    }

    return filtered;
  }, [transactions, searchKeyword, paymentMethodFilter]);

  // Get unique payment methods for filter
  const uniquePaymentMethods = useMemo(() => {
    const methods = new Set<string>();
    transactions.forEach((t) => {
      if (t.paymentMethod) {
        methods.add(t.paymentMethod);
      }
    });
    return Array.from(methods).sort();
  }, [transactions]);

  // Calculate stats from all transactions (not filtered)
  const stats = useMemo(() => {
    const total = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const payosCount = transactions.filter(
      (t) => t.paymentMethod === "PayOS"
    ).length;
    const cashCount = transactions.filter(
      (t) => t.paymentMethod === "Tiền mặt"
    ).length;

    return { total, totalAmount, payosCount, cashCount };
  }, [transactions]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortDirection("ASC");
    }
    setCurrentPage(0);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return (
        <div className="flex flex-col -space-y-1">
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
      );
    }
    return sortDirection === "ASC" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#78A243]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#78A243]" />
    );
  };

  const handleClearFilters = () => {
    setSearchKeyword("");
    setPaymentMethodFilter("");
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <ManagerGuard>
        <AdminPageLayout>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#EBD187] border-t-[#78A243] rounded-full animate-spin mb-4"></div>
            <p className="text-[#2D1E1A]/70 text-center">Đang tải dữ liệu...</p>
          </div>
        </AdminPageLayout>
      </ManagerGuard>
    );
  }

  return (
    <ManagerGuard>
      <AdminPageLayout>
        <AdminPageHeader title="Tài chính" icon={DollarSign} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminCard
            title="Tổng giao dịch"
            value={stats.total}
            icon={FileText}
            subtitle="Tổng số giao dịch"
          />
          <AdminCard
            title="Tổng doanh thu"
            value={formatCurrency(stats.totalAmount)}
            icon={DollarSign}
            subtitle="Tổng số tiền"
          />
          <AdminCard
            title="PayOS"
            value={stats.payosCount}
            icon={CreditCard}
            subtitle="Giao dịch PayOS"
          />
          <AdminCard
            title="Tiền mặt"
            value={stats.cashCount}
            icon={DollarSign}
            subtitle="Giao dịch tiền mặt"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white backdrop-blur-sm border-gray-300 border shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D1E1A]/60" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full max-w-[250px] pl-10 pr-4 py-2 border bg-white/80 border-[#78A243]/30 rounded-lg text-sm focus:border-[#78A243] focus:ring-1 focus:ring-[#78A243]/20 outline-none"
              />
            </div>
            {uniquePaymentMethods.length > 0 && (
              <FilterDropdown
                label="Tất cả phương thức"
                title="Lọc theo phương thức thanh toán"
                value={paymentMethodFilter}
                onChange={(value) => {
                  setPaymentMethodFilter(value);
                  setCurrentPage(0);
                }}
                items={uniquePaymentMethods.map((method) => ({
                  value: method,
                  label: method,
                }))}
                className="w-[180px]"
              />
            )}
            {(searchKeyword || paymentMethodFilter) && (
              <Button onClick={handleClearFilters} variant="ghost" size="sm">
                <X className="h-4 w-4 mr-1" />
                Xóa lọc
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-[#2D1E1A] font-medium whitespace-nowrap">
              Hiển thị:
            </label>
            <FilterDropdown
              label="Hiển thị"
              title="Số lượng hiển thị"
              value={pageSize.toString()}
              onChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(0);
              }}
              items={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
              ]}
              showAllOption={false}
              className="w-[80px]"
            />
            <span className="text-sm text-[#2D1E1A]/80 whitespace-nowrap">
              Tổng:{" "}
              <span className="font-bold text-[#78A243]">
                {filteredTransactions.length}
              </span>
            </span>
          </div>
        </div>

        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-white border-b-2 border-gray-300">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("paymentCode")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Mã thanh toán
                      {getSortIcon("paymentCode")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Số tiền
                      {getSortIcon("amount")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("transactionDate")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Ngày giao dịch
                      {getSortIcon("transactionDate")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold text-[#2D1E1A] cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort("paymentMethod")}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Phương thức
                      {getSortIcon("paymentMethod")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#78A243]/10">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-12 text-center text-[#2D1E1A]/70"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 text-[#78A243]/30" />
                      <p className="font-semibold">
                        Không tìm thấy giao dịch nào
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#EBD187]/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm text-[#2D1E1A]">
                          {transaction.paymentCode || (
                            <span className="text-gray-400 italic">
                              Chưa có mã
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-[#DA7339]">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-[#2D1E1A]">
                            {formatDate(transaction.transactionDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded-lg border ${getPaymentMethodBadgeClass(
                            transaction.paymentMethod
                          )}`}
                        >
                          {transaction.paymentMethod}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length > 0 && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[#78A243]/20 bg-gradient-to-r from-[#EBD187]/10 to-[#78A243]/5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#2D1E1A]/80">
                  Trang <span className="font-semibold">{currentPage + 1}</span>{" "}
                  / {totalPages} (Hiển thị {transactions.length} /{" "}
                  {totalElements} giao dịch)
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    variant="outline"
                    size="sm"
                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    variant="outline"
                    size="sm"
                    className="border-[#78A243]/30 text-[#2D1E1A] hover:bg-[#78A243]/10"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </AdminPageLayout>
    </ManagerGuard>
  );
}
