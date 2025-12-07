"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User as UserIcon, Shield, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createUser,
  createRoleHistory,
  type CreateUserRequest,
} from "@/apis/admin-user.api";
import { getRoles, type Role } from "@/apis/role.api";
import { useAdminContext } from "@/utils/contexts/AdminContext";
import { AdminSelect } from "../../components/AdminSelect";
import { AddressAutocomplete } from "@/components/common/address-autocomplete";
import {
  AdminPageLayout,
  AdminPageHeader,
} from "../../components/AdminPageLayout";

export default function CreateUserPage() {
  const router = useRouter();
  const { branches } = useAdminContext();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [emailVerified] = useState(false);
  const [phoneVerified] = useState(false);
  const [memberAssociationId] = useState<number | null>(null);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
      toast.error("Không thể tải danh sách vai trò!");
    } finally {
      setLoadingRoles(false);
    }
  };

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const showBranchField = selectedRole?.isInternal === true;

  const handleSubmit = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !dateOfBirth
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      toast.warning("Số điện thoại phải có đúng 10 chữ số!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.warning("Email không hợp lệ!");
      return;
    }

    const selectedDate = new Date(dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      toast.warning("Ngày sinh không được sau ngày hôm nay!");
      return;
    }

    const age = today.getFullYear() - selectedDate.getFullYear();
    if (
      age < 16 ||
      (age === 16 &&
        today <
          new Date(selectedDate.setFullYear(selectedDate.getFullYear() + 16)))
    ) {
      toast.warning("Người dùng phải từ 16 tuổi trở lên!");
      return;
    }

    if (!password) {
      toast.warning("Vui lòng nhập mật khẩu!");
      return;
    }

    if (password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!selectedRoleId) {
      toast.warning("Vui lòng chọn vai trò!");
      return;
    }

    if (showBranchField && !selectedBranchId) {
      toast.warning("Vui lòng chọn chi nhánh cho vai trò này!");
      return;
    }

    try {
      setLoading(true);

      const createData: CreateUserRequest = {
        fullName: fullName.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        password: password,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        note: note.trim(),
        emailVerified,
        phoneVerified,
        memberAssociationId: memberAssociationId || undefined,
      };

      const newUser = await createUser(createData);
      await createRoleHistory({
        userId: newUser.id,
        roleId: selectedRoleId,
        branchId: showBranchField ? selectedBranchId! : undefined,
        startDate: new Date().toISOString(),
      });

      toast.success("Tạo người dùng mới thành công!");
      router.push("/admin/users");
    } catch (err) {
      console.error("Failed to save user:", err);
      let errorMessage =
        "Không thể lưu thông tin người dùng. Vui lòng thử lại!";

      if (err && typeof err === "object") {
        const error = err as Record<string, unknown>;
        if (error.response && typeof error.response === "object") {
          const response = error.response as Record<string, unknown>;
          const errorData = response.data;
          if (errorData && typeof errorData === "object") {
            const data = errorData as Record<string, unknown>;
            if (typeof data.desc === "string") {
              errorMessage = data.desc;
            } else if (typeof data.message === "string") {
              errorMessage = data.message;
            } else if (typeof data.error === "string") {
              errorMessage = data.error;
            }
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } else if (typeof error.message === "string") {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Thêm người dùng mới"
        icon={UserIcon}
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/admin/users")}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <UserIcon className="h-4 w-4 text-[#78A243]" />
              Thông tin cá nhân
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) setPhoneNumber(value);
                    }}
                    maxLength={10}
                    placeholder="09xxxxxxxx"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Địa chỉ
                </label>
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  placeholder="Nhập địa chỉ..."
                  rows={2}
                />
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Shield className="h-4 w-4 text-[#78A243]" />
              Tài khoản & Vai trò
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  {loadingRoles ? (
                    <div className="text-sm text-gray-500 py-2">
                      Đang tải...
                    </div>
                  ) : (
                    <AdminSelect
                      value={selectedRoleId?.toString() || ""}
                      onValueChange={(value) => {
                        setSelectedRoleId(value ? parseInt(value) : null);
                        setSelectedBranchId(null);
                      }}
                      placeholder="Chọn vai trò"
                      options={roles
                        .filter((role) => role.id !== 1)
                        .map((role) => ({
                          value: role.id.toString(),
                          label: role.name,
                          subLabel: role.isInternal ? "Nội bộ" : undefined,
                        }))}
                      triggerClassName="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none h-auto"
                    />
                  )}
                </div>

                {showBranchField && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Chi nhánh <span className="text-red-500">*</span>
                    </label>
                    <AdminSelect
                      value={selectedBranchId?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedBranchId(value ? parseInt(value) : null)
                      }
                      placeholder="Chọn chi nhánh"
                      options={branches.map((branch) => ({
                        value: branch.id.toString(),
                        label: branch.name,
                      }))}
                      triggerClassName="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none h-auto"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú thêm..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#78A243] focus:ring-2 focus:ring-[#78A243]/20 transition-all resize-none outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button
            onClick={() => router.push("/admin/users")}
            variant="outline"
            className="px-5 py-2.5 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-[#78A243] hover:bg-[#78A243]/90 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tạo mới
              </>
            )}
          </Button>
        </div>
      </Card>
    </AdminPageLayout>
  );
}
