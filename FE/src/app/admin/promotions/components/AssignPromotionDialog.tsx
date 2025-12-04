"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { assignPromotion, type UserAssignment } from "@/apis/promotion.api";
import { getAllUsers, type UserSearchRequest } from "@/apis/user.api";
import { type User } from "@/apis/admin-user.api";

interface AssignPromotionDialogProps {
  promotionCode: string;
  promotionName: string;
  onSuccess: () => void;
}

export function AssignPromotionDialog({
  promotionCode,
  promotionName,
  onSuccess,
}: AssignPromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Map<number, number>>(
    new Map()
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  useEffect(() => {
    if (open) {
      setCurrentPage(0);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchCustomers();
    }
  }, [open, currentPage, searchKeyword]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const searchRequest: UserSearchRequest = {
        role: "CUSTOMER",
        status: false,
        page: currentPage,
        size: pageSize,
        sortBy: "id",
        sortDirection: "ASC",
      };

      if (searchKeyword) {
        searchRequest.keyword = searchKeyword;
      }

      const response = await getAllUsers(searchRequest);
      setCustomers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Không thể tải danh sách khách hàng!");
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchCustomers();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleUserSelection = (userId: number) => {
    const newSelectedUsers = new Map(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.set(userId, 1);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const updateUsageCount = (userId: number, count: number) => {
    if (count < 1) return;
    const newSelectedUsers = new Map(selectedUsers);
    newSelectedUsers.set(userId, count);
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = () => {
    const allSelected = customers.every((customer) =>
      selectedUsers.has(customer.id)
    );

    if (allSelected) {
      setSelectedUsers(new Map());
    } else {
      const newSelectedUsers = new Map(selectedUsers);
      customers.forEach((customer) => {
        if (!newSelectedUsers.has(customer.id)) {
          newSelectedUsers.set(customer.id, 1);
        }
      });
      setSelectedUsers(newSelectedUsers);
    }
  };

  const handleAssign = async () => {
    if (selectedUsers.size === 0) {
      toast.warning("Vui lòng chọn ít nhất một khách hàng!");
      return;
    }

    try {
      setLoading(true);

      const userAssignments: UserAssignment[] = Array.from(
        selectedUsers.entries()
      ).map(([userId, usageCount]) => ({
        userId,
        usageCount,
      }));

      await assignPromotion({
        promotionCode,
        userAssignments,
      });

      toast.success(`Đã gán khuyến mãi cho ${selectedUsers.size} khách hàng!`);
      setOpen(false);
      setSelectedUsers(new Map());
      onSuccess();
    } catch (error) {
      console.error("Failed to assign promotion:", error);
      toast.error("Không thể gán khuyến mãi!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUsers(new Map());
    setSearchKeyword("");
    setCurrentPage(0);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="bg-[#78A243] hover:bg-[#78A243]/90 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg items-center justify-center"
      >
        <UserPlus className="h-4 w-4 mr-1" />
        Gán KH
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl border-2 border-[#78A243]/20 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-[#78A243]/5 to-transparent flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#78A243] to-[#78A243]/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Gán khuyến mãi cho khách hàng
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Khuyến mãi:{" "}
                    <span className="font-bold text-[#78A243]">
                      {promotionName}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mã:{" "}
                    <span className="font-mono font-bold">{promotionCode}</span>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng (Enter để tìm)..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 outline-none"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loadingCustomers}
                  className="bg-[#78A243] hover:bg-[#78A243]/90 h-10"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm
                </Button>
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  className="border-[#78A243] text-[#78A243] hover:bg-[#78A243] hover:text-white font-semibold h-10"
                >
                  {customers.length > 0 &&
                  customers.every((customer) => selectedUsers.has(customer.id))
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </Button>
              </div>
            </div>

            <div className="px-6 space-y-3 overflow-y-auto flex-1">
              {loadingCustomers ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-[#78A243]/30 border-t-[#78A243] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Đang tải danh sách khách hàng...
                  </p>
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-semibold text-gray-900">
                    Không tìm thấy khách hàng
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              ) : (
                customers.map((customer) => {
                  const isSelected = selectedUsers.has(customer.id);
                  const usageCount = selectedUsers.get(customer.id) || 1;

                  return (
                    <div
                      key={customer.id}
                      className={`group relative rounded-xl border transition-all shadow-sm hover:shadow-md ${
                        isSelected
                          ? "border-[#78A243] bg-[#F7FBF2]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex gap-4 p-4">
                        <div className="flex flex-col items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleUserSelection(customer.id)}
                            className="h-5 w-5 rounded border-gray-300 text-[#78A243] focus:ring-[#78A243]"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-full bg-[#78A243]/10 flex items-center justify-center text-sm font-semibold text-[#78A243] flex-shrink-0">
                              {customer.fullName?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold text-gray-900 truncate max-w-[220px]">
                                {customer.fullName || "Khách lẻ"}
                              </h4>
                              {customer.memberAssociationName && (
                                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">
                                  {customer.memberAssociationName}
                                </Badge>
                              )}

                              {customer.emailVerified && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  ✓ Email
                                </Badge>
                              )}
                              {customer.phoneVerified && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  ✓ SĐT
                                </Badge>
                              )}
                              {customer.isBan && (
                                <Badge className="bg-red-100 text-red-700 text-xs">
                                  Đã khóa
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-1 truncate">
                              <span className="truncate">
                                {customer.email || "Chưa có email"}
                              </span>
                            </p>
                            <p className="flex items-center gap-1">
                              <span>
                                {customer.phoneNumber ||
                                  "Chưa có số điện thoại"}
                              </span>
                            </p>
                            <p className="flex items-center gap-1 truncate md:col-span-2">
                              <span className="truncate">
                                {customer.address || "Chưa có địa chỉ"}
                              </span>
                            </p>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span>
                                Điểm tích lũy:{" "}
                                <span className="font-bold text-[#F8A91F]">
                                  {customer.memberPoint}
                                </span>
                              </span>
                              {customer.dateOfBirth && (
                                <span>
                                  Sinh nhật:{" "}
                                  <span className="font-semibold text-gray-700">
                                    {new Date(
                                      customer.dateOfBirth
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </span>
                              )}
                              {customer.createdAt && (
                                <span>
                                  Tham gia:{" "}
                                  <span className="font-medium text-gray-700">
                                    {new Date(
                                      customer.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </span>
                              )}
                            </div>

                            {isSelected && (
                              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                                <span className="text-xs font-medium text-gray-700">
                                  Số lần sử dụng:
                                </span>
                                <input
                                  type="number"
                                  min="1"
                                  value={usageCount}
                                  onChange={(e) =>
                                    updateUsageCount(
                                      customer.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center text-sm font-semibold focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 outline-none"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                <div className="text-sm text-gray-600">
                  Trang{" "}
                  <span className="font-semibold text-[#78A243]">
                    {currentPage + 1}
                  </span>{" "}
                  / {totalPages}
                  {totalElements > 0 && (
                    <span className="ml-2 text-gray-500">
                      (Hiển thị {customers.length} / {totalElements} khách hàng)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || loadingCustomers}
                    variant="outline"
                    size="sm"
                    className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trước
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || loadingCustomers}
                    variant="outline"
                    size="sm"
                    className="border-[#78A243]/30 text-[#78A243] hover:bg-[#78A243]/10"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end flex-shrink-0">
              <Button
                onClick={handleClose}
                disabled={loading}
                variant="outline"
                className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 font-semibold"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleAssign}
                disabled={loading || selectedUsers.size === 0}
                className="px-5 py-2.5 bg-gradient-to-r from-[#78A243] to-[#78A243]/80 hover:from-[#78A243]/90 hover:to-[#78A243]/70 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Gán cho {selectedUsers.size} khách hàng
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
