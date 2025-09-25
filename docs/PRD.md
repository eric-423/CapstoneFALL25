# PRD — TamTech Customer Portal (Fall 2025)

## 1. Bối cảnh & Tầm nhìn
- **Sản phẩm:** Cổng trải nghiệm khách hàng TamTech (website responsive)
- **Mục tiêu học kỳ:** Hoàn thiện MVP cho khách hàng cuối (customer-facing) dựa trên thiết kế Figma `SEP490_TamTech_Fa25.pdf`
- **Giá trị cốt lõi:** Đặt món cơm tấm nhanh, cá nhân hoá và đồng bộ với hệ thống vận hành/nhượng quyền TamTech

## 2. Mục tiêu & Phi mục tiêu
### 2.1 Mục tiêu (Fall 2025)
1. Tái hiện trải nghiệm UI từ Figma trên nền Next.js + TypeScript + TailwindCSS v4
2. Cung cấp luồng đặt món cơ bản: khám phá menu → thêm vào giỏ → xem tóm tắt thanh toán
3. Trình bày câu chuyện thương hiệu, chương trình nhượng quyền và thông tin liên hệ rõ ràng
4. Chuẩn bị nền tảng để tích hợp API back-end ở giai đoạn tiếp theo (Sprint 2+)

### 2.2 Phi mục tiêu (ngoài phạm vi học kỳ này)
- Chưa xử lý thanh toán thực, giỏ hàng vẫn là dữ liệu giả lập
- Chưa triển khai quản trị viên, quản lý nội dung
- Chưa tối ưu SEO chuyên sâu hoặc i18n đa ngôn ngữ (Giữ mặc định tiếng Việt)

## 3. Đối tượng & Persona chính
| Persona | Nhu cầu chính | Hành vi nổi bật |
| --- | --- | --- |
| **Sinh viên nội thành** (18-24) | Đặt cơm nhanh trước giờ học, nhận ưu đãi | Dùng mobile, nhạy với voucher & combo tiết kiệm |
| **Người đi làm trẻ** (25-30) | Đặt nhóm cho văn phòng, cần giao nhanh | Dùng desktop tại công ty, thích đặt lại combo cũ |
| **Đối tác nhượng quyền** | Thu thập thông tin, đăng ký tư vấn | Ưu tiên nội dung franchise và form đăng ký |

## 4. Dòng chảy người dùng trọng tâm
1. **Khám phá trang chủ** → Nhận thông điệp thương hiệu, món nổi bật, trải nghiệm ứng dụng
2. **Xem menu** → Duyệt theo danh mục, đọc mô tả món, giá và huy hiệu nổi bật
3. **Thêm món vào giỏ** → Tương tác giả lập (button), xem tổng quan giỏ hàng
4. **Đăng ký / đăng nhập** → Điền form cơ bản (chưa kết nối back-end) cho bước tích hợp sau
5. **Liên hệ hỗ trợ** → Tìm thông tin hotline, form liên hệ, FAQ
6. **Tìm hiểu nhượng quyền** → Đọc thông tin chi nhánh, gửi form tư vấn

## 5. Phạm vi tính năng (
Sprint nội dung
)
| Nhóm màn hình | Chi tiết chức năng | Trạng thái |
| --- | --- | --- |
| **Trang chủ** | Hero, món nổi bật, trải nghiệm, franchise, testimonial, blog | ✔ (UI tĩnh) |
| **Menu** | Dữ liệu món (mock), danh mục, tag, CTA thêm giỏ | ✔ |
| **Giỏ hàng** | Danh sách món mock, tính toán tổng, CTA thanh toán | ✔ |
| **Đăng nhập / Đăng ký** | Form cơ bản, nhắc nhở SSO trong tương lai | ✔ |
| **Câu chuyện** | Timeline, giá trị cốt lõi, sứ mệnh | ✔ |
| **Ưu đãi** | Danh sách promotions (mock) | ✔ |
| **Liên hệ** | Kênh hỗ trợ, form gửi yêu cầu | ✔ |
| **Công nghệ** | Mô tả hạ tầng & dashboard | ✔ |
| **Tuyển dụng** | Danh sách vị trí (mock) | ✔ |
| **FAQ / Điều khoản / Quyền riêng tư** | Nội dung nền tảng để mở rộng | ✔ |

## 6. Nội dung & dữ liệu
- **Data mock:** Lưu tại `src/data/*` (menu, promotions, story, contact)
- **Iconography:** Sử dụng `lucide-react`
- **Kiểu chữ:** Google Font `Manrope` qua Next Font API
- **Brand palette:** Được đặt trong `globals.css` thông qua biến Tailwind inline theme
- **Hình ảnh:** Chưa dùng ảnh thực, thay bằng gradient / shape (tránh phụ thuộc asset)

## 7. KPI thành công (MVP)
- Đầy đủ màn hình UI theo scope Figma
- Passed `npm run lint`
- Layout responsive ổn định 3 breakpoint chính (mobile / tablet / desktop)
- Docs đi kèm đủ để team khác tiếp tục phát triển mà không cần đọc toàn bộ code

## 8. Giả định & Rủi ro
- Backend APIs sẽ được đội khác phát triển; mock hiện tại cần thay thế bằng hooks/services thật sau này
- Tailwind v4 (experimental) → cần theo dõi breaking changes, có thể chuyển sang v3 nếu gặp vấn đề build
- Turbopack trong phát triển; build production có thể cân nhắc `next build` thường nếu lỗi

## 9. Tài liệu liên quan
- Thiết kế Figma: `SEP490_TamTech_Fa25.pdf`
- Repo front-end: `CapstoneFALL25/FE`
- Tài liệu bổ sung: `Plan.md`, `Tasks.md`, `Specify.md`, `Rules.md`
