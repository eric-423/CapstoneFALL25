-- ========================================
-- SAMPLE DATA FOR COMIN TAM RESTAURANT SYSTEM
-- ========================================

-- Insert Member Associations (Hạng thành viên)
INSERT INTO member_association (member_association_point, member_association_name, member_association_description) VALUES
(0, 'Đồng', 'Hạng đồng - 0 điểm'),
(100, 'Bạc', 'Hạng bạc - 100 điểm'),
(500, 'Vàng', 'Hạng vàng - 500 điểm'),
(1000, 'Bạch Kim', 'Hạng bạch kim - 1000 điểm'),
(2000, 'Kim Cương', 'Hạng kim cương - 2000 điểm');

-- Insert Roles
INSERT INTO role (name) VALUES
('ADMIN'),
('MANAGER'),
('STAFF'),
('WAITER'),
('SHIPPER'),
('CUSTOMER');

-- Insert Users
-- Admin
INSERT INTO users (full_name, address, phone_number, email, password, date_of_birth, note, is_ban, created_at, member_point, email_verified, phone_verified, member_association_id) VALUES
('Nguyễn Văn Admin', '123 Nguyễn Huệ, Q1, TP.HCM', '0900000001', 'admin@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1990-01-01', 'Administrator chính', false, NOW(), 0, true, true, NULL),
('Trần Thị Quản Lý', '456 Điện Biên Phủ, Q3, TP.HCM', '0900000002', 'manager@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1992-05-15', 'Quản lý chi nhánh', false, NOW(), 0, true, true, NULL);

-- Managers (2 người cho 2 chi nhánh lớn)
INSERT INTO users (full_name, address, phone_number, email, password, date_of_birth, note, is_ban, created_at, member_point, email_verified, phone_verified, member_association_id) VALUES
('Lê Văn Quản', '789 Lý Tự Trọng, Q1, TP.HCM', '0901000101', 'manager1@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1988-03-20', 'Quản lý chi nhánh Quận 1', false, NOW(), 0, true, true, NULL),
('Phạm Thị Lan', '321 Nguyễn Văn Cừ, Q5, TP.HCM', '0901000202', 'manager2@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1990-07-10', 'Quản lý chi nhánh Quận 5', false, NOW(), 0, true, true, NULL);

-- Staffs (10 người)
INSERT INTO users (full_name, address, phone_number, email, password, date_of_birth, note, is_ban, created_at, member_point, email_verified, phone_verified, member_association_id) VALUES
('Hoàng Văn Phúc', '123 Cầu Kho, Q1, TP.HCM', '0902000001', 'staff1@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1995-02-14', 'Nhân viên bếp', false, NOW(), 0, true, true, NULL),
('Võ Thị Hương', '456 Bùi Viện, Q1, TP.HCM', '0902000002', 'staff2@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1993-09-22', 'Nhân viên phục vụ', false, NOW(), 0, true, true, NULL),
('Đỗ Văn Hùng', '789 Nguyễn Thái Học, Q1, TP.HCM', '0902000003', 'staff3@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1996-11-30', 'Nhân viên bếp', false, NOW(), 0, true, true, NULL),
('Bùi Thị Mai', '321 Lê Hồng Phong, Q5, TP.HCM', '0902000004', 'staff4@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1994-04-18', 'Nhân viên thu ngân', false, NOW(), 0, true, true, NULL),
('Lý Văn Đức', '123 Trần Hưng Đạo, Q5, TP.HCM', '0902000005', 'staff5@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1997-08-05', 'Nhân viên bếp', false, NOW(), 0, true, true, NULL),
('Ngô Thị Linh', '456 Võ Văn Tần, Q3, TP.HCM', '0902000006', 'staff6@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1995-12-12', 'Nhân viên phục vụ', false, NOW(), 0, true, true, NULL),
('Trịnh Văn Tuấn', '789 Nguyễn Đình Chiểu, Q3, TP.HCM', '0902000007', 'staff7@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1998-06-25', 'Nhân viên bếp', false, NOW(), 0, true, true, NULL),
('Nguyễn Thị Anh', '321 Hoàng Văn Thụ, Q3, TP.HCM', '0902000008', 'staff8@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1993-01-08', 'Nhân viên thu ngân', false, NOW(), 0, true, true, NULL),
('Phạm Văn Hòa', '123 Nguyễn Thái Sơn, Q7, TP.HCM', '0902000009', 'staff9@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1996-10-14', 'Nhân viên bếp', false, NOW(), 0, true, true, NULL),
('Đặng Thị Lan', '456 Huỳnh Tấn Phát, Q7, TP.HCM', '0902000010', 'staff10@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1994-03-20', 'Nhân viên phục vụ', false, NOW(), 0, true, true, NULL);

-- Waiters (5 người)
INSERT INTO users (full_name, address, phone_number, email, password, date_of_birth, note, is_ban, created_at, member_point, email_verified, phone_verified, member_association_id) VALUES
('Vũ Văn Nam', '123 Phạm Ngũ Lão, Q1, TP.HCM', '0903000001', 'waiter1@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1997-05-15', 'Phục vụ chi nhánh Q1', false, NOW(), 0, true, true, NULL),
('Đỗ Thị Ngọc', '456 Nguyễn Du, Q1, TP.HCM', '0903000002', 'waiter2@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1999-08-22', 'Phục vụ chi nhánh Q1', false, NOW(), 0, true, true, NULL),
('Lê Văn Sơn', '789 Chợ Lớn, Q5, TP.HCM', '0903000003', 'waiter3@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1996-11-10', 'Phục vụ chi nhánh Q5', false, NOW(), 0, true, true, NULL),
('Trần Thị Hoa', '321 Phạm Ngũ Lão, Q1, TP.HCM', '0903000004', 'waiter4@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1998-02-28', 'Phục vụ chi nhánh Q3', false, NOW(), 0, true, true, NULL),
('Nguyễn Văn Minh', '123 Nguyễn Cảnh Chân, Q1, TP.HCM', '0903000005', 'waiter5@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1995-07-05', 'Phục vụ chi nhánh Q7', false, NOW(), 0, true, true, NULL);

-- Shippers (3 người)
INSERT INTO users (full_name, address, phone_number, email, password, date_of_birth, note, is_ban, created_at, member_point, email_verified, phone_verified, member_association_id) VALUES
('Lý Văn Hải', '123 Hưng Đạo Vương, Q5, TP.HCM', '0904000001', 'shipper1@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1995-04-12', 'Shipper chi nhánh chính', false, NOW(), 0, true, true, NULL),
('Hoàng Thị Dung', '456 Minh Phụng, Q11, TP.HCM', '0904000002', 'shipper2@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1993-09-18', 'Shipper giao hàng', false, NOW(), 0, true, true, NULL),
('Phan Văn Tài', '789 Vĩnh Viễn, Q10, TP.HCM', '0904000003', 'shipper3@comtam.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1996-12-03', 'Shipper giao hàng', false, NOW(), 0, true, true, NULL);

-- Customers (20 khách hàng)
INSERT INTO users (full_name, address, phone_number, email, password, date_of_birth, note, is_ban, created_at, member_point, email_verified, phone_verified, member_association_id) VALUES
('Trần Văn Anh', '123 Nguyễn Huệ, Q1, TP.HCM', '0910000001', 'anhtran@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1990-01-05', 'Khách hàng VIP', false, NOW(), 250, true, true, 3),
('Nguyễn Thị Bình', '456 Lê Lợi, Q1, TP.HCM', '0910000002', 'binhnguyen@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1992-03-15', NULL, false, NOW(), 120, true, true, 2),
('Lê Văn Cường', '789 Lý Tự Trọng, Q3, TP.HCM', '0910000003', 'cuongle@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1988-07-20', NULL, false, NOW(), 850, true, true, 3),
('Phạm Thị Dung', '321 Nguyễn Văn Cừ, Q5, TP.HCM', '0910000004', 'dungpham@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1995-05-10', NULL, false, NOW(), 50, true, true, 1),
('Hoàng Văn Em', '123 Chợ Lớn, Q5, TP.HCM', '0910000005', 'emhoang@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1991-11-25', NULL, false, NOW(), 300, true, true, 3),
('Võ Thị Phượng', '456 Hải Thượng Lãn Ông, Q5, TP.HCM', '0910000006', 'phuongvo@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1994-09-08', NULL, false, NOW(), 680, true, true, 3),
('Đỗ Văn Giang', '789 Nguyễn Văn Luông, Q6, TP.HCM', '0910000007', 'giangdo@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1989-02-14', NULL, false, NOW(), 35, true, true, 1),
('Bùi Thị Hân', '321 An Dương Vương, Q5, TP.HCM', '0910000008', 'hanbui@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1993-06-30', NULL, false, NOW(), 450, true, true, 3),
('Lý Văn Hùng', '123 Hồng Bàng, Q5, TP.HCM', '0910000009', 'hungly@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1996-04-17', NULL, false, NOW(), 200, true, true, 3),
('Ngô Thị Im', '456 Tạ Uyên, Q11, TP.HCM', '0910000010', 'imngo@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1992-08-22', NULL, false, NOW(), 850, true, true, 3),
('Trịnh Văn Khoa', '789 Nguyễn Tri Phương, Q10, TP.HCM', '0910000011', 'khoatrinh@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1990-12-05', 'Khách hàng thân thiết', false, NOW(), 1200, true, true, 4),
('Vũ Thị Loan', '321 Cách Mạng Tháng 8, Q10, TP.HCM', '0910000012', 'loanvu@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1994-01-28', NULL, false, NOW(), 180, true, true, 2),
('Hoàng Văn Mạnh', '123 Nguyễn Ảnh Thủ, Q12, TP.HCM', '0910000013', 'manhhoang@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1991-03-12', NULL, false, NOW(), 600, true, true, 3),
('Đặng Thị Nga', '456 Nguyễn Chí Thanh, Q10, TP.HCM', '0910000014', 'ngadang@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1997-10-08', NULL, false, NOW(), 280, true, true, 3),
('Nguyễn Văn Oanh', '789 Lý Thường Kiệt, Q10, TP.HCM', '0910000015', 'oanhnguyen@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1993-05-20', NULL, false, NOW(), 950, true, true, 3),
('Phạm Thị Phương', '321 Trường Chinh, Q12, TP.HCM', '0910000016', 'phuongpham@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1995-11-14', NULL, false, NOW(), 1800, true, true, 4),
('Lê Văn Quang', '123 Dương Đình Nghệ, Q7, TP.HCM', '0910000017', 'quangle@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1989-09-03', NULL, false, NOW(), 750, true, true, 3),
('Trần Thị Quỳnh', '456 Nguyễn Thị Thập, Q7, TP.HCM', '0910000018', 'quynhtran@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1996-07-16', NULL, false, NOW(), 120, true, true, 2),
('Võ Văn Sơn', '789 Nguyễn Văn Linh, Q7, TP.HCM', '0910000019', 'sonvo@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1992-04-25', NULL, false, NOW(), 520, true, true, 3),
('Đỗ Thị Thảo', '321 Hà Huy Giáp, Q12, TP.HCM', '0910000020', 'thaodo@gmail.com', '$2a$10$bKQyL8VLZyVqXZrZPYX5x.oIJUCbTBCYfGNWYEqYjlkrmrl9GDxOy', '1994-08-11', 'Khách hàng thân thiết', false, NOW(), 2150, true, true, 5);

-- Insert Role History
-- Admin (không cần branch)
INSERT INTO role_history (start_date, end_date, is_active, role_id, user_id, branch_id) VALUES
(NOW(), NULL, true, 1, 1, NULL),
(NOW(), NULL, true, 1, 2, NULL);

-- Managers
INSERT INTO role_history (start_date, end_date, is_active, role_id, user_id, branch_id) VALUES
('2024-01-01', NULL, true, 2, 3, 1),
('2024-01-01', NULL, true, 2, 4, 4);

-- Staffs (phân bố vào các chi nhánh)
INSERT INTO role_history (start_date, end_date, is_active, role_id, user_id, branch_id) VALUES
('2024-02-01', NULL, true, 3, 5, 1),
('2024-02-01', NULL, true, 3, 6, 1),
('2024-02-01', NULL, true, 3, 7, 1),
('2024-02-01', NULL, true, 3, 8, 4),
('2024-02-01', NULL, true, 3, 9, 4),
('2024-02-01', NULL, true, 3, 10, 2),
('2024-02-01', NULL, true, 3, 11, 2),
('2024-02-01', NULL, true, 3, 12, 2),
('2024-02-01', NULL, true, 3, 13, 3),
('2024-02-01', NULL, true, 3, 14, 3);

-- Waiters
INSERT INTO role_history (start_date, end_date, is_active, role_id, user_id, branch_id) VALUES
('2024-03-01', NULL, true, 4, 15, 1),
('2024-03-01', NULL, true, 4, 16, 1),
('2024-03-01', NULL, true, 4, 17, 4),
('2024-03-01', NULL, true, 4, 18, 2),
('2024-03-01', NULL, true, 4, 19, 3);

-- Shippers
INSERT INTO role_history (start_date, end_date, is_active, role_id, user_id, branch_id) VALUES
('2024-04-01', NULL, true, 5, 20, 1),
('2024-04-01', NULL, true, 5, 21, 1),
('2024-04-01', NULL, true, 5, 22, 1);

-- Customers
INSERT INTO role_history (start_date, end_date, is_active, role_id, user_id, branch_id) VALUES
(NOW(), NULL, true, 6, 23, 1),
(NOW(), NULL, true, 6, 24, 1),
(NOW(), NULL, true, 6, 25, 2),
(NOW(), NULL, true, 6, 26, 4),
(NOW(), NULL, true, 6, 27, 4),
(NOW(), NULL, true, 6, 28, 4),
(NOW(), NULL, true, 6, 29, 4),
(NOW(), NULL, true, 6, 30, 4),
(NOW(), NULL, true, 6, 31, 1),
(NOW(), NULL, true, 6, 32, 2),
(NOW(), NULL, true, 6, 33, 2),
(NOW(), NULL, true, 6, 34, 2),
(NOW(), NULL, true, 6, 35, 3),
(NOW(), NULL, true, 6, 36, 3),
(NOW(), NULL, true, 6, 37, 3),
(NOW(), NULL, true, 6, 38, 1),
(NOW(), NULL, true, 6, 39, 2),
(NOW(), NULL, true, 6, 40, 3),
(NOW(), NULL, true, 6, 41, 4),
(NOW(), NULL, true, 6, 42, 1);

-- Insert Product Types
INSERT INTO product_type (name) VALUES
('Cơm tấm'),
('Thức uống'),
('Cơm trắng'),
('Đồ ăn kèm');

-- Insert Material Types
INSERT INTO material_type (material_type_name) VALUES
('Thịt'),
('Rau'),
('Gạo'),
('Gia vị'),
('Đồ uống'),
('Trứng'),
('Xúc xích');

-- Insert Materials
INSERT INTO material (material_name, material_type_id) VALUES
-- Thịt
('Sườn nướng', 1),
('Thịt nướng', 1),
('Gà nướng', 1),
('Chả trứng', 1),
('Bì bún', 1),
('Chả lụa', 1),
-- Rau
('Dưa leo', 2),
('Cà chua', 2),
('Đậu phộng', 2),
('Giá đỗ', 2),
('Xà lách', 2),
('Chuối xanh', 2),
-- Gạo
('Gạo tấm', 3),
('Gạo trắng', 3),
-- Gia vị
('Nước mắm', 4),
('Ớt', 4),
('Hành lá', 4),
('Tiêu', 4),
-- Trứng
('Trứng ốp la', 6),
-- Khác
('Xúc xích Đức', 7),
('Canh chua', 2);

-- Insert Branches
INSERT INTO branch (name, address, phone_number, is_parent) VALUES
('Chi nhánh 1 - Quận 1', '123 Lê Lợi, Quận 1, TP.HCM', '0901234567', true),
('Chi nhánh 2 - Quận 3', '456 Nguyễn Đình Chiểu, Quận 3, TP.HCM', '0901234568', false),
('Chi nhánh 3 - Quận 7', '789 Nguyễn Thái Sơn, Quận 7, TP.HCM', '0901234569', false),
('Chi nhánh 4 - Quận 5', '321 Nguyễn Trãi, Quận 5, TP.HCM', '0901234570', false);

-- Insert Warehouses for each branch
INSERT INTO warehouse (warehouse_name, branch_id) VALUES
('Kho chi nhánh Quận 1', 1),
('Kho chi nhánh Quận 3', 2),
('Kho chi nhánh Quận 7', 3),
('Kho chi nhánh Quận 5', 4);

-- Insert Products (Cơm tấm dishes)
INSERT INTO product (product_name, product_description, product_price, product_image, create_date, update_date, is_active, product_type_id) VALUES
('Cơm tấm sườn nướng', 'Cơm tấm với sườn heo nướng thơm lừng, kèm bì chả trứng cà', 50000, 'com-tam-suon-nuong.jpg', NOW(), NOW(), true, 1),
('Cơm tấm bì chả trứng cà', 'Cơm tấm bì bún ăn kèm chả trứng và cà tím nướng', 45000, 'com-tam-bi-cha-trung-ca.jpg', NOW(), NOW(), true, 1),
('Cơm tấm gà nướng', 'Cơm tấm với đùi gà nướng mật ong, thơm béo', 55000, 'com-tam-ga-nuong.jpg', NOW(), NOW(), true, 1),
('Cơm tấm thịt nướng', 'Cơm tấm thịt heo nướng BBQ đậm đà', 50000, 'com-tam-thit-nuong.jpg', NOW(), NOW(), true, 1),
('Cơm tấm sườn cây', 'Cơm tấm với sườn cây dài nướng thơm ngon', 60000, 'com-tam-suon-cay.jpg', NOW(), NOW(), true, 1),
('Cơm tấm đặc biệt', 'Cơm tấm đầy đủ sườn, chả, trứng, bì, bì chả, xúc xích', 65000, 'com-tam-dac-biet.jpg', NOW(), NOW(), true, 1),
('Cơm tấm bì chả chạo tôm', 'Cơm tấm bì chả trứng và chạo tôm nướng', 55000, 'com-tam-bi-cha-chao-tom.jpg', NOW(), NOW(), true, 1),
('Cơm tấm nem nướng', 'Cơm tấm với nem nướng Nha Trang', 55000, 'com-tam-nem-nuong.jpg', NOW(), NOW(), true, 1),

-- Drinks
('Chanh muối', 'Chanh muối mát lạnh giải nhiệt', 15000, 'chanh-muoi.jpg', NOW(), NOW(), true, 2),
('Soda chanh dây', 'Soda chanh dây chua ngọt thanh mát', 20000, 'soda-chanh-day.jpg', NOW(), NOW(), true, 2),
('Nước mía', 'Nước mía tươi ngon giải khát', 15000, 'nuoc-mia.jpg', NOW(), NOW(), true, 2),
('Sữa tươi', 'Sữa tươi đường đá', 20000, 'sua-tuoi.jpg', NOW(), NOW(), true, 2),
('Cà phê đá', 'Cà phê phin truyền thống', 20000, 'ca-phe-da.jpg', NOW(), NOW(), true, 2),
('Trà đá', 'Trà đá mát lạnh', 10000, 'tra-da.jpg', NOW(), NOW(), true, 2),

-- Rice
('Cơm trắng', 'Cơm trắng dẻo thơm', 10000, 'com-trang.jpg', NOW(), NOW(), true, 3),

-- Side dishes
('Trứng ốp la', 'Trứng ốp la giòn ngoài mềm trong', 15000, 'trung-op-la.jpg', NOW(), NOW(), true, 4),
('Chả trứng', 'Chả trứng chiên vàng thơm', 10000, 'cha-trung.jpg', NOW(), NOW(), true, 4),
('Bì bún', 'Bì bún sợi giòn sần sật', 10000, 'bi-bun.jpg', NOW(), NOW(), true, 4),
('Canh chua', 'Canh chua cá bạc má chua cay', 15000, 'canh-chua.jpg', NOW(), NOW(), true, 4),
('Dưa cà muối', 'Dưa chua cà muối đậm đà', 5000, 'dua-ca-muoi.jpg', NOW(), NOW(), true, 4);

-- Insert Product Recipes (Ingredients for each product)
-- Cơm tấm sườn nướng
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(1, 12, 0.2), -- Gạo tấm
(1, 13, 1.0), -- Nước mắm
(1, 14, 0.1), -- Ớt
(1, 15, 0.05), -- Hành lá
(1, 6, 0.1), -- Chả lụa
(1, 7, 0.05); -- Dưa leo

-- Cơm tấm bì chả trứng cà
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(2, 12, 0.2),
(2, 13, 1.0),
(2, 4, 0.05), -- Chả trứng
(2, 5, 0.05), -- Bì bún
(2, 7, 0.05);

-- Cơm tấm gà nướng
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(3, 12, 0.2),
(3, 13, 1.0),
(3, 3, 0.15), -- Gà
(3, 7, 0.05);

-- Cơm tấm thịt nướng
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(4, 12, 0.2),
(4, 13, 1.0),
(4, 2, 0.15), -- Thịt nướng
(4, 7, 0.05);

-- Cơm tấm sườn cây
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(5, 12, 0.2),
(5, 13, 1.0),
(5, 1, 0.2), -- Sườn nướng
(5, 7, 0.05);

-- Cơm tấm đặc biệt
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(6, 12, 0.2),
(6, 13, 1.0),
(6, 1, 0.15),
(6, 4, 0.05),
(6, 5, 0.05),
(6, 17, 0.05),
(6, 7, 0.05);

-- Cơm tấm bì chả chạo tôm
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(7, 12, 0.2),
(7, 13, 1.0),
(7, 4, 0.05),
(7, 5, 0.05),
(7, 7, 0.05);

-- Cơm tấm nem nướng
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(8, 12, 0.2),
(8, 13, 1.0),
(8, 7, 0.05);

-- Drinks recipes
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(9, 18, 0.3), -- Chanh muối
(10, 18, 0.3), -- Soda chanh dây
(11, 3, 0.2), -- Nước mía (simplified)
(12, 3, 0.3), -- Sữa tươi
(13, 3, 0.2), -- Cà phê
(14, 3, 0.1); -- Trà đá

-- Cơm trắng
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(15, 18, 0.2); -- Gạo trắng

-- Side dishes recipes
INSERT INTO product_recipes (product_id, material_id, quantity) VALUES
(16, 16, 1.0), -- Trứng ốp la
(17, 4, 1.0), -- Chả trứng
(18, 5, 1.0), -- Bì bún
(19, 18, 0.5), -- Canh chua
(20, 7, 0.1); -- Dưa cà

-- Insert Branch Products (Available products at each branch)
-- Branch 1 products
INSERT INTO branch_product (branch_id, product_id, quantity) VALUES
(1, 1, 100), (1, 2, 100), (1, 3, 100), (1, 4, 100), (1, 5, 80), (1, 6, 60),
(1, 7, 70), (1, 8, 70), (1, 9, 200), (1, 10, 150), (1, 11, 150),
(1, 12, 150), (1, 13, 100), (1, 14, 200), (1, 15, 200), (1, 16, 100),
(1, 17, 100), (1, 18, 100), (1, 19, 50), (1, 20, 100);

-- Branch 2 products
INSERT INTO branch_product (branch_id, product_id, quantity) VALUES
(2, 1, 90), (2, 2, 90), (2, 3, 90), (2, 4, 90), (2, 5, 75),
(2, 6, 50), (2, 7, 60), (2, 8, 60), (2, 9, 180), (2, 10, 140),
(2, 11, 140), (2, 12, 140), (2, 13, 90), (2, 14, 180), (2, 15, 180),
(2, 16, 90), (2, 17, 90), (2, 18, 90), (2, 19, 40), (2, 20, 90);

-- Branch 3 products
INSERT INTO branch_product (branch_id, product_id, quantity) VALUES
(3, 1, 85), (3, 2, 85), (3, 3, 85), (3, 4, 85), (3, 5, 70),
(3, 6, 45), (3, 7, 55), (3, 8, 55), (3, 9, 170), (3, 10, 130),
(3, 11, 130), (3, 12, 130), (3, 13, 85), (3, 14, 170), (3, 15, 170),
(3, 16, 85), (3, 17, 85), (3, 18, 85), (3, 19, 35), (3, 20, 85);

-- Branch 4 products
INSERT INTO branch_product (branch_id, product_id, quantity) VALUES
(4, 1, 95), (4, 2, 95), (4, 3, 95), (4, 4, 95), (4, 5, 78),
(4, 6, 55), (4, 7, 65), (4, 8, 65), (4, 9, 190), (4, 10, 145),
(4, 11, 145), (4, 12, 145), (4, 13, 95), (4, 14, 190), (4, 15, 190),
(4, 16, 95), (4, 17, 95), (4, 18, 95), (4, 19, 45), (4, 20, 95);

-- Insert Material Warehouse (Inventory at each warehouse)
-- Warehouse 1 (Branch 1)
INSERT INTO material_warehouse (material_id, warehouse_id, quantity) VALUES
(1, 1, 50.0), -- Sườn nướng
(2, 1, 50.0), -- Thịt nướng
(3, 1, 100.0), -- Gà nướng
(4, 1, 200.0), -- Chả trứng
(5, 1, 200.0), -- Bì bún
(6, 1, 100.0), -- Chả lụa
(7, 1, 500.0), -- Dưa leo
(8, 1, 200.0), -- Cà chua
(9, 1, 300.0), -- Đậu phộng
(10, 1, 200.0), -- Giá đỗ
(11, 1, 300.0), -- Xà lách
(12, 1, 5000.0), -- Gạo tấm (kg)
(13, 1, 1000.0), -- Nước mắm
(14, 1, 500.0), -- Ớt
(15, 1, 300.0), -- Hành lá
(16, 1, 1000.0), -- Trứng
(17, 1, 200.0), -- Xúc xích
(18, 1, 1000.0); -- Gạo trắng (kg)

-- Warehouse 2 (Branch 2)
INSERT INTO material_warehouse (material_id, warehouse_id, quantity) VALUES
(1, 2, 45.0), (2, 2, 45.0), (3, 2, 90.0), (4, 2, 180.0), (5, 2, 180.0),
(6, 2, 90.0), (7, 2, 450.0), (8, 2, 180.0), (9, 2, 270.0), (10, 2, 180.0),
(11, 2, 270.0), (12, 2, 4500.0), (13, 2, 900.0), (14, 2, 450.0), (15, 2, 270.0), 
(16, 2, 900.0), (17, 2, 180.0), (18, 2, 900.0);

-- Warehouse 3 (Branch 3)
INSERT INTO material_warehouse (material_id, warehouse_id, quantity) VALUES
(1, 3, 40.0), (2, 3, 40.0), (3, 3, 85.0), (4, 3, 170.0), (5, 3, 170.0),
(6, 3, 85.0), (7, 3, 400.0), (8, 3, 170.0), (9, 3, 260.0), (10, 3, 170.0),
(11, 3, 260.0), (12, 3, 4000.0), (13, 3, 850.0), (14, 3, 400.0), (15, 3, 260.0), 
(16, 3, 850.0), (17, 3, 170.0), (18, 3, 800.0);

-- Warehouse 4 (Branch 4)
INSERT INTO material_warehouse (material_id, warehouse_id, quantity) VALUES
(1, 4, 48.0), (2, 4, 48.0), (3, 4, 95.0), (4, 4, 190.0), (5, 4, 190.0),
(6, 4, 95.0), (7, 4, 480.0), (8, 4, 190.0), (9, 4, 290.0), (10, 4, 190.0),
(11, 4, 290.0), (12, 4, 4800.0), (13, 4, 950.0), (14, 4, 480.0), (15, 4, 290.0), 
(16, 4, 950.0), (17, 4, 190.0), (18, 4, 950.0);

-- Insert Promotion Types
INSERT INTO promotion_type (promotion_type_name) VALUES
('Giảm giá theo %'),
('Giảm giá cố định'),
('Miễn phí vận chuyển'),
('Mua kèm giảm giá');

-- Insert Promotions
INSERT INTO promotion (promotion_id, promotion_name, promotion_description, promotion_discount, minimum_order_value, promotion_start_date, promotion_end_date, promotion_status, created_at, promotion_type_id, user_id) VALUES
(UUID(), 'Khuyến mãi 20% thứ 2', 'Giảm 20% tất cả các món vào thứ 2 hàng tuần', 20, 100000, '2025-01-01', '2025-12-31', true, NOW(), 1, NULL),
(UUID(), 'Combo gia đình', 'Giảm 30000đ cho đơn hàng trên 200000đ', 30000, 200000, '2025-01-01', '2025-12-31', true, NOW(), 2, NULL),
(UUID(), 'Free ship cho đơn trên 50000đ', 'Miễn phí vận chuyển cho đơn hàng trên 50000đ', 0, 50000, '2025-01-01', '2025-12-31', true, NOW(), 3, NULL);

-- Insert Combos for each branch
-- Branch 1
INSERT INTO combo (name, description, price, start_date, end_date, is_active, created_at, updated_at, branch_id) VALUES
('Combo cơm tấm 2 người', '2 phần cơm tấm sườn + 2 chanh muối', 110000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 1),
('Combo cơm tấm 3 người', '3 phần cơm tấm đặc biệt + 3 chanh muối', 205000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 1),
('Combo gia đình 4 người', '4 phần cơm tấm sườn + 4 chanh muối + 1 cơm tấm đặc biệt', 295000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 1);

-- Branch 2
INSERT INTO combo (name, description, price, start_date, end_date, is_active, created_at, updated_at, branch_id) VALUES
('Combo cơm tấm 2 người', '2 phần cơm tấm sườn + 2 chanh muối', 110000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 2),
('Combo cơm tấm 3 người', '3 phần cơm tấm đặc biệt + 3 chanh muối', 205000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 2),
('Combo gia đình 4 người', '4 phần cơm tấm sườn + 4 chanh muối + 1 cơm tấm đặc biệt', 295000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 2);

-- Branch 3
INSERT INTO combo (name, description, price, start_date, end_date, is_active, created_at, updated_at, branch_id) VALUES
('Combo cơm tấm 2 người', '2 phần cơm tấm sườn + 2 chanh muối', 110000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 3),
('Combo cơm tấm 3 người', '3 phần cơm tấm đặc biệt + 3 chanh muối', 205000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 3),
('Combo gia đình 4 người', '4 phần cơm tấm sườn + 4 chanh muối + 1 cơm tấm đặc biệt', 295000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 3);

-- Branch 4
INSERT INTO combo (name, description, price, start_date, end_date, is_active, created_at, updated_at, branch_id) VALUES
('Combo cơm tấm 2 người', '2 phần cơm tấm sườn + 2 chanh muối', 110000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 4),
('Combo cơm tấm 3 người', '3 phần cơm tấm đặc biệt + 3 chanh muối', 205000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 4),
('Combo gia đình 4 người', '4 phần cơm tấm sườn + 4 chanh muối + 1 cơm tấm đặc biệt', 295000, '2025-01-01', '2025-12-31', true, NOW(), NOW(), 4);

-- Insert Combo Items for all branches
-- Branch 1 Combos (combo_id 1-3)
INSERT INTO combo_item (note, quantity, combo_id, product_id) VALUES
('Phần chính', 2, 1, 1),
('Nước uống', 2, 1, 9),
('Phần chính', 3, 2, 6),
('Nước uống', 3, 2, 9),
('Phần chính', 4, 3, 1),
('Phần đặc biệt', 1, 3, 6),
('Nước uống', 4, 3, 9);

-- Branch 2 Combos (combo_id 4-6)
INSERT INTO combo_item (note, quantity, combo_id, product_id) VALUES
('Phần chính', 2, 4, 1),
('Nước uống', 2, 4, 9),
('Phần chính', 3, 5, 6),
('Nước uống', 3, 5, 9),
('Phần chính', 4, 6, 1),
('Phần đặc biệt', 1, 6, 6),
('Nước uống', 4, 6, 9);

-- Branch 3 Combos (combo_id 7-9)
INSERT INTO combo_item (note, quantity, combo_id, product_id) VALUES
('Phần chính', 2, 7, 1),
('Nước uống', 2, 7, 9),
('Phần chính', 3, 8, 6),
('Nước uống', 3, 8, 9),
('Phần chính', 4, 9, 1),
('Phần đặc biệt', 1, 9, 6),
('Nước uống', 4, 9, 9);

-- Branch 4 Combos (combo_id 10-12)
INSERT INTO combo_item (note, quantity, combo_id, product_id) VALUES
('Phần chính', 2, 10, 1),
('Nước uống', 2, 10, 9),
('Phần chính', 3, 11, 6),
('Nước uống', 3, 11, 9),
('Phần chính', 4, 12, 1),
('Phần đặc biệt', 1, 12, 6),
('Nước uống', 4, 12, 9);

