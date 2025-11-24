"use client";

import { GuestLayout } from "@/components/layouts/GuestLayout";
import { loginCustomerViaApiRoute, sendOtp } from "@/apis/user.api";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  );
  const [globalMessage, setGlobalMessage] = useState<{
    type: "error" | "info";
    text: string;
  } | null>(null);
  const { redirectAfterLogin } = useAuthContext();

  useEffect(() => {
    const savedPhone = localStorage.getItem("rememberedPhone");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedPhone && savedRememberMe) {
      setPhone(savedPhone);
      setRememberMe(true);
    }
  }, []);

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalMessage(null);
    setErrors({});

    // Client-side validation để cải thiện UX
    if (!validatePhone(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Số điện thoại không hợp lệ (cần 10 số)",
      }));
      return;
    }

    setLoading(true);

    try {
      const response = await loginCustomerViaApiRoute({
        phoneNumber: phone,
        password,
      });

      if (response.status === 200 && response.data?.token) {
        if (rememberMe) {
          localStorage.setItem("rememberedPhone", phone);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedPhone");
          localStorage.setItem("rememberMe", "false");
        }

        localStorage.setItem("access_token", response.data.token);

        const role = response.data.userInfo?.role || "CUSTOMER";
        redirectAfterLogin(role);
      }
    } catch (error: unknown) {
      const apiErrorMessage =
        (
          error as {
            response?: { data?: { error?: string; message?: string } };
          }
        )?.response?.data?.error ||
        (
          error as {
            response?: { data?: { error?: string; message?: string } };
          }
        )?.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";

      let feedbackMessage: string | null = apiErrorMessage;

      if (apiErrorMessage.includes("Số điện thoại chưa được xác thực")) {
        setErrors((prev) => ({ ...prev, phone: apiErrorMessage }));
        feedbackMessage = null;
      }

      if (feedbackMessage) {
        setGlobalMessage({ type: "error", text: feedbackMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!validatePhone(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Vui lòng nhập số điện thoại hợp lệ (cần 10 số)",
      }));
      setGlobalMessage({
        type: "error",
        text: "Vui lòng nhập số điện thoại hợp lệ trước.",
      });
      return;
    }

    setGlobalMessage(null);
    setResendOtpLoading(true);
    try {
      await sendOtp("zalo", phone);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingLoginPhone", phone);
        sessionStorage.setItem("pendingLoginPassword", password);
      }
      router.push(`/register?phone=${encodeURIComponent(phone)}`);
      return;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { desc?: string; message?: string } } })
          ?.response?.data?.desc ||
        (error as { response?: { data?: { desc?: string; message?: string } } })
          ?.response?.data?.message ||
        "Không thể gửi OTP. Vui lòng thử lại.";
      setGlobalMessage({ type: "error", text: errorMessage });
    } finally {
      setResendOtpLoading(false);
    }
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-[#FFF5E6] flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <Image
            src="/images/Home - Banner.jpg"
            alt="Tấm Tắc Food"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div>
              <h2 className="text-4xl font-bold">Tấm Tắc Food</h2>
              <p className="mt-4 text-base leading-relaxed text-gray-100">
                Tận hưởng bữa cơm sinh viên chuẩn vị nhà làm với tốc độ phục vụ
                nhanh chóng.
              </p>
            </div>
            <div className="space-y-4 text-sm text-gray-200">
              <div>
                <p className="font-semibold">Ưu đãi thành viên</p>
                <p>
                  Tích điểm thưởng, nhận voucher giảm giá và cập nhật thực đơn
                  mỗi ngày.
                </p>
              </div>
              <div>
                <p className="font-semibold">Giao hàng tận nơi</p>
                <p>
                  Đặt món qua ứng dụng, giao đến ký túc xá trong vòng 20 phút.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-semibold text-gray-900">
                <span className="text-[#FF6B35]">Đăng nhập</span> khách hàng
              </h1>
              <p className="mt-3 text-sm text-gray-600">
                Đồng bộ trải nghiệm với ứng dụng Tấm Tắc: đặt món, theo dõi đơn
                và tích điểm dễ dàng.
              </p>
              {globalMessage && (
                <p
                  className={`mt-4 text-sm font-medium ${
                    globalMessage.type === "error"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {globalMessage.text}
                </p>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={`rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 placeholder:text-slate-400`}
                />

                {errors.phone && (
                  <>
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    {errors.phone ===
                      "Số điện thoại chưa được xác thực. Vui lòng xác thực số điện thoại trước khi đăng nhập." && (
                      <button
                        type="button"
                        className="mt-2 ml-2 text-sm text-[#FF6B35] underline disabled:opacity-50"
                        onClick={handleResendOtp}
                        disabled={resendOtpLoading}
                      >
                        {resendOtpLoading
                          ? "Đang gửi..."
                          : "Gửi lại mã xác thực"}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className={`rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 pr-12 placeholder:text-slate-400`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm text-gray-500 hover:text-[#FF6B35]"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link
                  href="mailto:cs@tam-tac.com"
                  className="text-[#FF6B35] font-medium hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-[#FF6B35] py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5722] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <Link
                    href="/register"
                    className="bg-[#FFF5E6] px-4 text-[#FF6B35] font-medium hover:text-[#FF5722] transition-colors"
                  >
                    Bạn chưa là người nhà của Tấm Tắc?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
