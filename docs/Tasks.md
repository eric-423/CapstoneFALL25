# Tasks — TamTech Customer Portal

## 1. Trạng thái chung
- **Sprint hiện tại:** Sprint 1 — Lên UI nền tảng customer-facing
- **Ngày cập nhật:** 22/09/2025
- **Scope tái hiện:** Các màn customer theo Figma PDF, chưa tích hợp API

## 2. Bảng công việc
### 2.1 Đã hoàn thành
- [x] Khởi tạo dự án Next.js 15 + TypeScript + TailwindCSS v4 (App Router)
- [x] Thiết lập layout chung (header/navbar, footer, theme tokens)
- [x] Dựng UI trang chủ với các section hero, món nổi bật, trải nghiệm, franchise, testimonial, blog
- [x] Tạo trang menu + mock data món ăn
- [x] Tạo trang giỏ hàng mock logic tính tổng
- [x] Forms: đăng nhập, đăng ký, liên hệ, nhượng quyền
- [x] Trang câu chuyện, ưu đãi, công nghệ, tuyển dụng, FAQ, điều khoản, quyền riêng tư
- [x] Đồng bộ lint `npm run lint`

### 2.2 Đang thực hiện
- [ ] Viết tài liệu context (PRD, Plan, Specify, Rules, Tasks) ✅ _đang hoàn thiện file này_
- [ ] Tổ chức lại mock data thành module cho future API integration _(dự kiến Sprint 2)_

### 2.3 Sắp thực hiện (ưu tiên giảm dần)
1. **Thiết kế state backend:** định nghĩa schema API cho menu, cart, promotions
2. **Kết nối services:** tạo layer gọi API (React Query hoặc Zustand) sau khi có backend
3. **Auth thực tế:** tích hợp SSO trường / OTP (tuỳ backend)
4. **Kiểm thử responsive chi tiết:** manual QA trên iOS Safari, Android Chrome
5. **SEO & Analytics:** thêm metadata, cấu hình `next-seo`, GA4

## 3. Nhiệm vụ mở rộng / Parking lot
- PWA / offline mode (bị hoãn)
- Hệ thống loyalty + dashboard nội bộ (ngoài phạm vi Sprint 1)
- Localisation (tiếng Anh) khi product scale rộng

## 4. Người phụ trách (tạm thời)
| Hạng mục | Trạng thái | Owner gợi ý |
| --- | --- | --- |
| UI/UX cập nhật | Đã cover phần lớn | Front-end team |
| Kết nối API | Đang chờ | Back-end / tích hợp |
| QA responsive | Chưa bắt đầu | QA hoặc front-end |
| Document duy trì | Đang viết | Người phụ trách AI / chủ repo |

## 5. Ghi chú thêm
- Mọi dữ liệu hiện tại đều nằm trong `src/data/*.ts` → thay bằng API sau
- Khi spin up backend, cần cập nhật lại Tasks.md với ticket cụ thể (ví dụ: `TASK-BE-01`)
- Khuyến khích tạo issue tracker riêng (Github Projects hoặc Linear) để bám sát hơn sau sprint này
