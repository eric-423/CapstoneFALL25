"use client";

import { GuestLayout } from "@/components/layouts/GuestLayout";
import { loginCustomerViaApiRoute, sendOtp } from "@/apis/user.api";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/utils/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import headerText from "@/assets/images/headerText.png";
export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {}
  );
  const [globalMessage, setGlobalMessage] = useState<{
    type: "error" | "info";
    text: string;
  } | null>(null);
  const { redirectAfterLogin } = useAuthContext();

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalMessage(null);
    setErrors({});
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


      if (response.status === 200 && response.data?.success) {
        redirectAfterLogin("CUSTOMER");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: string } })?.response?.data ||
        "Đăng nhập thất bại. Vui lòng thử lại.";

      if (
        typeof errorMessage === 'string' &&
        errorMessage.includes("chưa được xác thực")
      ) {
        setErrors((prev) => ({
          ...prev,
          phone: "Số điện thoại này chưa được xác thực. Vui lòng xác thực tại đây",
        }));
      } else {
        setGlobalMessage({
          type: "error",
          text: typeof errorMessage === 'string' ? errorMessage : "Đăng nhập thất bại. Vui lòng thử lại.",
        });
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
      <div className="min-h-screen bg-[#FFFCF7] flex flex-col lg:flex-row">
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
              <Image
                src={headerText}
                alt="Tấm Tắc"
                width={300}
                height={80}
                className="object-contain"
              />
              <p className="text-base leading-relaxed text-gray-100">
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

        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                <span className="text-[#FF6B35]">Đăng nhập</span> khách hàng
              </h1>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 px-2">
                Đồng bộ trải nghiệm với ứng dụng Tấm Tắc: đặt món, theo dõi đơn
                và tích điểm dễ dàng.
              </p>
              {globalMessage && (
                <p
                  className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium px-2 ${globalMessage.type === "error"
                    ? "text-red-600"
                    : "text-gray-700"
                    }`}
                >
                  {globalMessage.text}
                </p>
              )}
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 sm:mb-2 block text-sm font-medium text-slate-700"
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
                  className={`rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:border-[#FF6B35] focus:ring-[#FF6B35] h-11 sm:h-12 placeholder:text-slate-400 text-sm sm:text-base`}
                />

                {errors.phone && (
                  <>
                    <p className="mt-1 text-xs sm:text-sm text-red-600 break-words ">
                      {errors.phone === "Số điện thoại này chưa được xác thực. Vui lòng xác thực tại đây" ? (
                        <>
                          Số điện thoại này chưa được xác thực. Vui lòng xác thực {" "}
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendOtpLoading}
                            className="cursor-pointer text-[#FF6B35] underline font-medium hover:text-[#FF5722] disabled:opacity-50"
                          >
                            {resendOtpLoading ? "đang xử lý..." : "tại đây"}
                          </button>
                        </>
                      ) : (
                        errors.phone
                      )}
                    </p>
                  </>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 sm:mb-2 block text-sm font-medium text-slate-700"
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
                    className={`rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:border-[#FF6B35] focus:ring-[#FF6B35] h-11 sm:h-12 pr-12 placeholder:text-slate-400 text-sm sm:text-base`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-xs sm:text-sm text-gray-500 hover:text-[#FF6B35]"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                <Link
                  href={
                    phone
                      ? `/forgot-password?phone=${encodeURIComponent(phone)}`
                      : "/forgot-password"
                  }
                  className="text-[#FF6B35] font-medium hover:underline whitespace-nowrap"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-[#FF6B35] py-2.5 sm:py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5722] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] disabled:opacity-50 transition-colors h-11 sm:h-12"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </form>

            <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center px-2">
                  <Link
                    href="/register"
                    className="bg-[#FFF5E6] px-3 sm:px-4 py-1 text-[#FF6B35] font-medium hover:text-[#FF5722] transition-colors text-center"
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
