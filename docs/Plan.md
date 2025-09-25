# Plan — Roadmap TamTech Customer Portal (Fall 2025)

## 1. Lộ trình tổng quan
| Giai đoạn | Thời gian | Mục tiêu chính |
| --- | --- | --- |
| **Sprint 1 (Tuần 1-2)** | 22/09 → 05/10 | Dựng UI tĩnh theo Figma, tạo mock data, thiết lập guideline dự án |
| **Sprint 2 (Tuần 3-4)** | 06/10 → 19/10 | Kết nối back-end API (menu, auth cơ bản, orders mock), hoàn thiện state management |
| **Sprint 3 (Tuần 5-6)** | 20/10 → 02/11 | Tối ưu trải nghiệm (loading state, validation), bổ sung SEO + analytics |
| **Final Sprint (Tuần 7)** | 03/11 → 09/11 | Kiểm thử end-to-end, chuẩn bị demo, hoàn thiện tài liệu bàn giao |

## 2. Mốc chi tiết & Deliverable
### Sprint 1 — UI Foundation _(đã hoàn tất)_
- ✅ Next.js project với layout chung (header/footer, theme tokens)
- ✅ Tất cả trang customer-facing theo scope Figma
- ✅ Mock data + cấu trúc thư mục `src/data`, `src/components`
- ✅ Bộ tài liệu định hướng (PRD/Plan/Tasks/Specify/Rules)

### Sprint 2 — API Integration
- [ ] Thiết kế interface dữ liệu + map với backend (OpenAPI / TypeScript types dùng chung)
- [ ] Tích hợp gọi API thực cho menu, promotions, franchise info
- [ ] State management (React Query/Zustand) + loading/error state
- [ ] Bảo vệ route yêu cầu đăng nhập (client-side guard tạm thời)

### Sprint 3 — UX polish & Infra
- [ ] Form validation (React Hook Form + Zod)
- [ ] Toast/feedback trạng thái (success, error)
- [ ] SEO baseline (metadata, OpenGraph, sitemap)
- [ ] Tracking (GA4 hoặc Posthog)

### Final Sprint — QA & Handover
- [ ] Manual QA đa thiết bị, checklist accessibility cơ bản
- [ ] Viết hướng dẫn deploy + thông số environment
- [ ] Demo script & slide recap tính năng

## 3. Phụ thuộc & rủi ro
- **Backend readiness:** cần API specification chậm nhất đầu Sprint 2
- **Auth provider:** xác định rõ solution (OTP, SSO trường) để front-end chuẩn bị flow
- **Tailwind v4 Beta:** theo dõi cập nhật, fallback Tailwind v3 nếu build không ổn định

## 4. Cách làm việc đề xuất
- Tách task thành issues (UI, data, integration) → gán owner rõ ràng
- Mỗi sprint kết thúc phải **cập nhật Tasks.md** và note risk mới (nếu có)
- Giữ branch chính `main` luôn build-able; dùng PR cho từng hạng mục
- Sau khi backend sẵn sàng, thiết lập môi trường `.env` + hướng dẫn trong README

## 5. Link tham chiếu nhanh
- Repo front-end: `CapstoneFALL25/FE`
- Thiết kế: `SEP490_TamTech_Fa25.pdf`
- Tài liệu kỹ thuật: xem `Specify.md`
- Quy ước coding: xem `Rules.md`
