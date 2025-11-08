INSERT INTO payment_method (payment_method_name) VALUES
    ('Tiền mặt'),
    ('PayOS'),


INSERT INTO order_status (order_status_name) VALUES
    ('CREATED'),
    ('COOKING'),
    ('COOKED'),
    ('IN_PROCESS'),
    ('SHIPPING'),
    ('DELIVERED'),
    ('COMPLETED'),
    ('CANCEL'),
    ('PAID');


INSERT INTO dining_table (name, is_active, seat, note, branch_id) VALUES
    ('Bàn 1', true, 2, 'Bàn nhỏ 2 người', 1),
    ('Bàn 2', true, 2, 'Bàn nhỏ 2 người', 1),
    ('Bàn 3', true, 4, 'Bàn vừa 4 người', 1),
    ('Bàn 4', true, 4, 'Bàn vừa 4 người', 1),
    ('Bàn 5', true, 4, 'Bàn vừa 4 người', 1),
    ('Bàn 6', true, 6, 'Bàn lớn 6 người', 1),
    ('Bàn 7', true, 6, 'Bàn lớn 6 người', 1),
    ('Bàn 8', true, 8, 'Bàn VIP 8 người', 1),
    ('Bàn 9', true, 2, 'Bàn nhỏ 2 người', 1),
    ('Bàn 10', true, 4, 'Bàn vừa 4 người', 1),
    ('Bàn 11', true, 4, 'Bàn vừa 4 người', 1),
    ('Bàn 12', true, 6, 'Bàn lớn 6 người', 1),
    ('Bàn 13', true, 2, 'Bàn nhỏ 2 người', 1),
    ('Bàn 14', true, 4, 'Bàn vừa 4 người', 1),
    ('Bàn 15', true, 10, 'Bàn gia đình 10 người', 1);


INSERT INTO dining_table (name, is_active, seat, note, branch_id) VALUES
    ('Bàn 1', true, 2, 'Bàn nhỏ 2 người', 2),
    ('Bàn 2', true, 2, 'Bàn nhỏ 2 người', 2),
    ('Bàn 3', true, 4, 'Bàn vừa 4 người', 2),
    ('Bàn 4', true, 4, 'Bàn vừa 4 người', 2),
    ('Bàn 5', true, 4, 'Bàn vừa 4 người', 2),
    ('Bàn 6', true, 6, 'Bàn lớn 6 người', 2),
    ('Bàn 7', true, 6, 'Bàn lớn 6 người', 2),
    ('Bàn 8', true, 8, 'Bàn VIP 8 người', 2),
    ('Bàn 9', true, 2, 'Bàn nhỏ 2 người', 2),
    ('Bàn 10', true, 4, 'Bàn vừa 4 người', 2),
    ('Bàn 11', true, 4, 'Bàn vừa 4 người', 2),
    ('Bàn 12', true, 6, 'Bàn lớn 6 người', 2);



INSERT INTO dining_table (name, is_active, seat, note, branch_id) VALUES
    ('Bàn 1', true, 2, 'Bàn nhỏ 2 người', 3),
    ('Bàn 2', true, 2, 'Bàn nhỏ 2 người', 3),
    ('Bàn 3', true, 4, 'Bàn vừa 4 người', 3),
    ('Bàn 4', true, 4, 'Bàn vừa 4 người', 3),
    ('Bàn 5', true, 4, 'Bàn vừa 4 người', 3),
    ('Bàn 6', true, 6, 'Bàn lớn 6 người', 3),
    ('Bàn 7', true, 6, 'Bàn lớn 6 người', 3),
    ('Bàn 8', true, 8, 'Bàn VIP 8 người', 3),
    ('Bàn 9', true, 2, 'Bàn nhỏ 2 người', 3),
    ('Bàn 10', true, 4, 'Bàn vừa 4 người', 3);


INSERT INTO dining_table (name, is_active, seat, note, branch_id) VALUES
    ('Bàn 1', true, 2, 'Bàn nhỏ 2 người', 4),
    ('Bàn 2', true, 2, 'Bàn nhỏ 2 người', 4),
    ('Bàn 3', true, 4, 'Bàn vừa 4 người', 4),
    ('Bàn 4', true, 4, 'Bàn vừa 4 người', 4),
    ('Bàn 5', true, 4, 'Bàn vừa 4 người', 4),
    ('Bàn 6', true, 6, 'Bàn lớn 6 người', 4),
    ('Bàn 7', true, 6, 'Bàn lớn 6 người', 4),
    ('Bàn 8', true, 8, 'Bàn VIP 8 người', 4),
    ('Bàn 9', true, 2, 'Bàn nhỏ 2 người', 4),
    ('Bàn 10', true, 4, 'Bàn vừa 4 người', 4),
    ('Bàn 11', true, 4, 'Bàn vừa 4 người', 4),
    ('Bàn 12', true, 6, 'Bàn lớn 6 người', 4);


INSERT INTO information (information_name, information_address, information_phone, is_default, user_id) VALUES
    ('Nhà riêng', '123 Nguyễn Huệ, Q1, TP.HCM', '0910000001', true, 23),
    ('Công ty', '456 Lê Lợi, Q1, TP.HCM', '0910000001', false, 23),
    ('Nhà riêng', '456 Lê Lợi, Q1, TP.HCM', '0910000002', true, 24),
    ('Nhà riêng', '789 Lý Tự Trọng, Q3, TP.HCM', '0910000003', true, 25),
    ('Nhà bạn', '321 Nguyễn Văn Cừ, Q5, TP.HCM', '0910000003', false, 25),
    ('Nhà riêng', '321 Nguyễn Văn Cừ, Q5, TP.HCM', '0910000004', true, 26),
    ('Nhà riêng', '123 Chợ Lớn, Q5, TP.HCM', '0910000005', true, 27),
    ('Nhà riêng', '789 Nguyễn Tri Phương, Q10, TP.HCM', '0910000011', true, 31),
    ('Văn phòng', '123 Cách Mạng Tháng 8, Q10, TP.HCM', '0910000011', false, 31),
    ('Nhà riêng', '321 Trường Chinh, Q12, TP.HCM', '0910000016', true, 36),
    ('Nhà riêng', '321 Hà Huy Giáp, Q12, TP.HCM', '0910000020', true, 42),
    ('Công ty', '456 Nguyễn Thị Thập, Q7, TP.HCM', '0910000020', false, 42);


INSERT INTO notification_type (notification_type_name) VALUES
    ('Đơn hàng mới'),
    ('Đơn hàng đã được xác nhận'),
    ('Đơn hàng đang được chuẩn bị'),
    ('Đơn hàng đã sẵn sàng'),
    ('Đơn hàng đang được giao'),
    ('Đơn hàng đã giao thành công'),
    ('Khuyến mãi mới'),
    ('Thông báo hệ thống'),
    ('Nhắc nhở thanh toán'),
    ('Đánh giá đơn hàng');


INSERT INTO notification (notification_name, notification_content, notification_ref_link, notification_is_seen, notification_created_at, receiver_id, sender_id, notification_type_id) VALUES
    ('Đơn hàng #1 đã được tạo', 'Đơn hàng của bạn đã được tạo thành công. Vui lòng thanh toán trong vòng 15 phút.', '/orders/1', false, DATE_SUB(NOW(), INTERVAL 2 DAY), 23, 1, 1),
    ('Đơn hàng #1 đã được xác nhận', 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.', '/orders/1', false, DATE_SUB(NOW(), INTERVAL 1 DAY), 23, 3, 2),
    ('Khuyến mãi cuối tuần', 'Giảm 20% tất cả các món vào thứ 2 hàng tuần. Áp dụng cho đơn hàng trên 100,000đ.', '/promotions', false, DATE_SUB(NOW(), INTERVAL 3 DAY), 24, 1, 7),
    ('Nhắc nhở đánh giá', 'Bạn có muốn đánh giá đơn hàng #2 không?', '/orders/2/feedback', false, DATE_SUB(NOW(), INTERVAL 1 DAY), 25, 1, 10),
    ('Đơn hàng đã giao thành công', 'Đơn hàng #3 của bạn đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ!', '/orders/3', true, DATE_SUB(NOW(), INTERVAL 5 DAY), 26, 20, 6);


INSERT INTO blog_type (blog_type_name) VALUES
    ('Tin tức'),
    ('Khuyến mãi'),
    ('Công thức nấu ăn'),
    ('Giới thiệu món mới'),
    ('Sự kiện'),
    ('Hướng dẫn');



INSERT INTO blog (blog_title, blog_content, blog_image, blog_status, blog_type_id, author_id) VALUES
    ('Giới thiệu món Cơm Tấm Sườn Nướng đặc biệt', 
     'Cơm tấm sườn nướng là món ăn đặc trưng của miền Nam Việt Nam. Với sườn heo được ướp gia vị đậm đà và nướng trên than hoa, món ăn này mang đến hương vị khó quên. Kèm theo là bì bún giòn tan, chả trứng thơm ngon và nước mắm pha chua ngọt đậm đà.',
     'blog-com-tam-suon.jpg', true, 4, 1),
    ('Khuyến mãi đặc biệt tháng 12 - Giảm 30% cho đơn hàng trên 200k', 
     'Nhân dịp cuối năm, nhà hàng áp dụng chương trình khuyến mãi đặc biệt: Giảm 30% cho tất cả đơn hàng trên 200,000đ. Chương trình áp dụng từ ngày 1/12 đến hết ngày 31/12/2025.',
     'blog-khuyen-mai-thang-12.jpg', true, 2, 1),
    ('Công thức làm nước mắm pha chuẩn vị miền Nam', 
     'Nước mắm pha là linh hồn của món cơm tấm. Công thức chuẩn: 3 muỗng nước mắm, 2 muỗng đường, 1 muỗng nước cốt chanh, tỏi ớt băm nhuyễn. Khuấy đều và thêm chút nước lọc để có độ loãng vừa phải.',
     'blog-nuoc-mam-pha.jpg', true, 3, 2),
    ('Món mới: Cơm Tấm Nem Nướng Nha Trang', 
     'Chúng tôi tự hào giới thiệu món mới: Cơm Tấm Nem Nướng Nha Trang. Nem được làm từ thịt heo tươi, nướng trên than hoa, có vị ngọt đặc trưng của Nha Trang.',
     'blog-nem-nuong.jpg', true, 4, 1),
    ('Sự kiện: Ngày hội Cơm Tấm miền Nam', 
     'Tham gia ngày hội Cơm Tấm miền Nam vào cuối tuần này. Nhiều hoạt động thú vị và quà tặng hấp dẫn đang chờ đón bạn!',
     'blog-ngay-hoi.jpg', true, 5, 2);



INSERT INTO chat_room (name, created_at) VALUES
    ('Hỗ trợ khách hàng', DATE_SUB(NOW(), INTERVAL 30 DAY)),
    ('Nhóm quản lý', DATE_SUB(NOW(), INTERVAL 20 DAY)),
    ('Nhóm nhân viên bếp', DATE_SUB(NOW(), INTERVAL 15 DAY)),
    ('Nhóm shipper', DATE_SUB(NOW(), INTERVAL 10 DAY));


INSERT INTO chat_room_user (chat_room_id, user_id) VALUES
    (1, 1),
    (1, 23),
    (1, 24),
    (1, 25);


INSERT INTO chat_room_user (chat_room_id, user_id) VALUES
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4);



INSERT INTO chat_room_user (chat_room_id, user_id) VALUES
    (3, 5),
    (3, 7),
    (3, 9),
    (3, 11),
    (3, 13);


INSERT INTO chat_room_user (chat_room_id, user_id) VALUES
    (4, 20),
    (4, 21),
    (4, 22);


INSERT INTO message (content, send_time, chat_room_id, sender_id) VALUES
    ('Xin chào, tôi muốn hỏi về giờ mở cửa của nhà hàng?', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 23),
    ('Chào bạn! Nhà hàng mở cửa từ 6h sáng đến 10h tối hàng ngày.', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 1),
    ('Cảm ơn bạn nhiều!', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 23),
    ('Họp định kỳ tháng này sẽ diễn ra vào thứ 6 tuần sau', DATE_SUB(NOW(), INTERVAL 1 DAY), 2, 1),
    ('Đã nhận được thông báo, cảm ơn admin!', DATE_SUB(NOW(), INTERVAL 1 DAY), 2, 3),
    ('Nhớ chuẩn bị đủ nguyên liệu cho ca tối nhé các bạn', DATE_SUB(NOW(), INTERVAL 5 HOUR), 3, 5),
    ('Đã kiểm tra kho, đủ nguyên liệu rồi anh', DATE_SUB(NOW(), INTERVAL 4 HOUR), 3, 7);


INSERT INTO black_list (address, phone_number, branch_id) VALUES
    ('999 Đường giả mạo, Q1, TP.HCM', '0999999999', 1),
    ('888 Địa chỉ không hợp lệ, Q3, TP.HCM', '0888888888', 2),
    ('777 Số điện thoại spam, Q5, TP.HCM', '0777777777', 4);


INSERT INTO contract (contract_start_date, contract_end_date, contract_status, contract_ref_link, contract_term, branch_id, user_id) VALUES
    ('2024-01-01', '2025-12-31', true, '/contracts/contract_manager1.pdf', 'Hợp đồng lao động không xác định thời hạn', 1, 3),
    ('2024-01-01', '2025-12-31', true, '/contracts/contract_manager2.pdf', 'Hợp đồng lao động không xác định thời hạn', 4, 4),
    ('2024-02-01', '2025-01-31', true, '/contracts/contract_staff1.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 1, 5),
    ('2024-02-01', '2025-01-31', true, '/contracts/contract_staff2.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 1, 6),
    ('2024-02-01', '2025-01-31', true, '/contracts/contract_staff3.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 4, 8),
    ('2024-03-01', '2025-02-28', true, '/contracts/contract_waiter1.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 1, 15),
    ('2024-03-01', '2025-02-28', true, '/contracts/contract_waiter2.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 1, 16),
    ('2024-04-01', '2025-03-31', true, '/contracts/contract_shipper1.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 1, 20),
    ('2024-04-01', '2025-03-31', true, '/contracts/contract_shipper2.pdf', 'Hợp đồng lao động có thời hạn 1 năm', 1, 21);


INSERT INTO utensils_type (utensils_type_name) VALUES
    ('Nồi'),
    ('Chảo'),
    ('Dao'),
    ('Thớt'),
    ('Kẹp'),
    ('Muỗng'),
    ('Đũa'),
    ('Bát đĩa'),
    ('Máy móc');


INSERT INTO cooking_utensils (cooking_utensils_name, cooking_utensils_quantity, utensils_type_id, warehouse_id) VALUES
    ('Nồi lớn 50L', 5, 1, 1),
    ('Nồi vừa 30L', 8, 1, 1),
    ('Chảo lớn', 10, 2, 1),
    ('Chảo nhỏ', 15, 2, 1),
    ('Dao thái thịt', 12, 3, 1),
    ('Dao thái rau', 15, 3, 1),
    ('Thớt lớn', 10, 4, 1),
    ('Thớt nhỏ', 20, 4, 1),
    ('Kẹp nướng', 15, 5, 1),
    ('Muỗng lớn', 20, 6, 1),
    ('Đũa cả', 30, 7, 1),
    ('Bát đĩa sứ', 200, 8, 1),
    ('Máy xay thịt', 2, 9, 1),
    ('Lò nướng', 3, 9, 1);


INSERT INTO cooking_utensils (cooking_utensils_name, cooking_utensils_quantity, utensils_type_id, warehouse_id) VALUES
    ('Nồi lớn 50L', 4, 1, 2),
    ('Nồi vừa 30L', 6, 1, 2),
    ('Chảo lớn', 8, 2, 2),
    ('Chảo nhỏ', 12, 2, 2),
    ('Dao thái thịt', 10, 3, 2),
    ('Dao thái rau', 12, 3, 2),
    ('Thớt lớn', 8, 4, 2),
    ('Thớt nhỏ', 15, 4, 2),
    ('Kẹp nướng', 12, 5, 2),
    ('Muỗng lớn', 15, 6, 2),
    ('Đũa cả', 25, 7, 2),
    ('Bát đĩa sứ', 150, 8, 2),
    ('Máy xay thịt', 1, 9, 2),
    ('Lò nướng', 2, 9, 2);



INSERT INTO cooking_utensils (cooking_utensils_name, cooking_utensils_quantity, utensils_type_id, warehouse_id) VALUES
    ('Nồi lớn 50L', 3, 1, 3),
    ('Nồi vừa 30L', 5, 1, 3),
    ('Chảo lớn', 7, 2, 3),
    ('Chảo nhỏ', 10, 2, 3),
    ('Dao thái thịt', 8, 3, 3),
    ('Dao thái rau', 10, 3, 3),
    ('Thớt lớn', 6, 4, 3),
    ('Thớt nhỏ', 12, 4, 3),
    ('Kẹp nướng', 10, 5, 3),
    ('Muỗng lớn', 12, 6, 3),
    ('Đũa cả', 20, 7, 3),
    ('Bát đĩa sứ', 120, 8, 3),
    ('Máy xay thịt', 1, 9, 3),
    ('Lò nướng', 2, 9, 3);


INSERT INTO cooking_utensils (cooking_utensils_name, cooking_utensils_quantity, utensils_type_id, warehouse_id) VALUES
    ('Nồi lớn 50L', 4, 1, 4),
    ('Nồi vừa 30L', 7, 1, 4),
    ('Chảo lớn', 9, 2, 4),
    ('Chảo nhỏ', 13, 2, 4),
    ('Dao thái thịt', 11, 3, 4),
    ('Dao thái rau', 13, 3, 4),
    ('Thớt lớn', 9, 4, 4),
    ('Thớt nhỏ', 18, 4, 4),
    ('Kẹp nướng', 13, 5, 4),
    ('Muỗng lớn', 18, 6, 4),
    ('Đũa cả', 28, 7, 4),
    ('Bát đĩa sứ', 180, 8, 4),
    ('Máy xay thịt', 2, 9, 4),
    ('Lò nướng', 2, 9, 4);


INSERT INTO `order` (order_sub_total, order_promotion_code, order_discount_value, order_discount_percent, order_amount, order_shiping_free, order_delivery_at, order_note, order_payment_code, order_address, order_phone, order_point_used, order_point_earned, order_created_at, is_pick_up, payment_time, is_table, customer_name, customer_email, customer_id, branch_id, status_id, payment_method_id) VALUES
    (150000, NULL, 0, 0, 170000, 20000, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Giao vào buổi trưa', NULL, '123 Nguyễn Huệ, Q1, TP.HCM', '0910000001', 0, 150, DATE_SUB(NOW(), INTERVAL 5 DAY), false, DATE_SUB(NOW(), INTERVAL 5 DAY), false, 'Trần Văn Anh', 'anhtran@gmail.com', 23, 1, 7, 2),
    (200000, 'COMBO_GIA_DINH', 30000, 0, 190000, 20000, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Giao trước 12h', NULL, '456 Lê Lợi, Q1, TP.HCM', '0910000002', 0, 200, DATE_SUB(NOW(), INTERVAL 3 DAY), false, DATE_SUB(NOW(), INTERVAL 3 DAY), false, 'Nguyễn Thị Bình', 'binhnguyen@gmail.com', 24, 1, 7, 2),
    (100000, NULL, 0, 20, 100000, 0, DATE_ADD(NOW(), INTERVAL 2 DAY), NULL, NULL, '789 Lý Tự Trọng, Q3, TP.HCM', '0910000003', 0, 100, DATE_SUB(NOW(), INTERVAL 1 DAY), false, NULL, false, 'Lê Văn Cường', 'cuongle@gmail.com', 25, 2, 1, NULL);


INSERT INTO `order` (order_sub_total, order_promotion_code, order_discount_value, order_discount_percent, order_amount, order_shiping_free, order_delivery_at, order_note, order_payment_code, order_address, order_phone, order_point_used, order_point_earned, order_created_at, is_pick_up, payment_time, is_table, customer_name, customer_email, customer_id, branch_id, status_id, payment_method_id, dining_table_id, waiter_id) VALUES
    (120000, NULL, 0, 0, 120000, 0, NULL, 'Không cay', NULL, NULL, '0910000004', 0, 120, DATE_SUB(NOW(), INTERVAL 2 HOUR), false, NULL, true, 'Phạm Thị Dung', 'dungpham@gmail.com', 26, 4, 4, NULL, 1, 17),
    (180000, NULL, 0, 0, 180000, 0, NULL, 'Thêm nước mắm', NULL, NULL, '0910000005', 0, 180, DATE_SUB(NOW(), INTERVAL 1 HOUR), false, NULL, true, 'Hoàng Văn Em', 'emhoang@gmail.com', 27, 4, 3, NULL, 2, 17);



INSERT INTO `order` (order_sub_total, order_promotion_code, order_discount_value, order_discount_percent, order_amount, order_shiping_free, order_delivery_at, order_note, order_payment_code, order_address, order_phone, order_point_used, order_point_earned, order_created_at, is_pick_up, payment_time, pickup_time, is_table, customer_name, customer_email, customer_id, branch_id, status_id, payment_method_id) VALUES
    (80000, NULL, 0, 0, 80000, 0, NULL, 'Lấy lúc 18h', NULL, NULL, '0910000006', 0, 80, DATE_SUB(NOW(), INTERVAL 1 DAY), true, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), false, 'Võ Thị Phượng', 'phuongvo@gmail.com', 28, 4, 7, 1);



INSERT INTO order_item (order_id, product_id, quantity, price, note, is_confirm, confirm_at) VALUES
    (1, 1, 2, 50000, NULL, true, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (1, 9, 2, 15000, NULL, true, DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (1, 16, 1, 15000, NULL, true, DATE_SUB(NOW(), INTERVAL 5 DAY));



INSERT INTO order_item (order_id, product_id, quantity, price, note, is_confirm, confirm_at) VALUES
    (2, 6, 2, 65000, NULL, true, DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (2, 9, 2, 15000, NULL, true, DATE_SUB(NOW(), INTERVAL 3 DAY));



INSERT INTO order_item (order_id, product_id, quantity, price, note, is_confirm, confirm_at) VALUES
    (3, 3, 1, 55000, NULL, false, NULL),
    (3, 4, 1, 50000, NULL, false, NULL);



INSERT INTO order_item (order_id, product_id, quantity, price, note, is_confirm, confirm_at, is_delivered) VALUES
    (4, 1, 2, 50000, 'Không cay', true, DATE_SUB(NOW(), INTERVAL 2 HOUR), true),
    (4, 9, 2, 15000, NULL, true, DATE_SUB(NOW(), INTERVAL 2 HOUR), true);



INSERT INTO order_item (order_id, product_id, quantity, price, note, is_confirm, confirm_at, is_delivered) VALUES
    (5, 6, 2, 65000, 'Thêm nước mắm', true, DATE_SUB(NOW(), INTERVAL 1 HOUR), false),
    (5, 10, 2, 20000, NULL, true, DATE_SUB(NOW(), INTERVAL 1 HOUR), false);



INSERT INTO order_item (order_id, product_id, quantity, price, note, is_confirm, confirm_at) VALUES
    (6, 1, 1, 50000, NULL, true, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (6, 9, 2, 15000, NULL, true, DATE_SUB(NOW(), INTERVAL 1 DAY));
