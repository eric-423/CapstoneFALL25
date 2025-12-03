package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.Order;
import com.capstone.tamtech.capstone.entities.OrderItem;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;

@Service
public class PdfBillService {

    @Autowired
    private QRCodeService qrCodeService;

    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

    public byte[] generateBill(Order order) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument, PageSize.A4);

        document.setMargins(40, 40, 40, 40);

        PdfFont font = null;
        try {
            font = PdfFontFactory.createFont("fonts/DejaVuSans.ttf", PdfEncodings.IDENTITY_H);
        } catch (Exception e) {
            try {
                font = PdfFontFactory.createFont("Helvetica", PdfEncodings.IDENTITY_H);
            } catch (Exception ex) {
                font = PdfFontFactory.createFont();
            }
        }

        document.setFont(font);

        try {
            ClassPathResource logoResource = new ClassPathResource("images/logo-full-bg.png");
            if (logoResource.exists()) {
                InputStream logoStream = logoResource.getInputStream();
                byte[] logoBytes = logoStream.readAllBytes();
                Image logo = new Image(ImageDataFactory.create(logoBytes));
                logo.setWidth(100);
                logo.setHorizontalAlignment(HorizontalAlignment.CENTER);
                document.add(logo);
            }
        } catch (Exception e) {
            System.err.println("Logo not found: " + e.getMessage());
        }

        Paragraph header = new Paragraph("TÂM TECH RESTAURANT")
                .setFont(font)
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10);
        document.add(header);

        Paragraph subheader = new Paragraph("HÓA ĐƠN THANH TOÁN")
                .setFont(font)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(subheader);

        document.add(new Paragraph("THÔNG TIN ĐƠN HÀNG")
                .setFontSize(14)
                .setBold()
                .setMarginTop(10)
                .setMarginBottom(10));

        Table infoTable = new Table(new float[] { 200, 300 });
        infoTable.setWidth(UnitValue.createPercentValue(100));

        addInfoRow(infoTable, "Mã đơn hàng:", "#" + order.getId());
        addInfoRow(infoTable, "Ngày đặt:", dateFormat.format(order.getCreatedAt()));

        if (order.getCustomer() != null) {
            addInfoRow(infoTable, "Khách hàng:", order.getCustomer().getFullName());
            addInfoRow(infoTable, "Số điện thoại:", order.getCustomer().getPhoneNumber());
        }

        if (order.getAddress() != null && !order.getAddress().isEmpty()) {
            addInfoRow(infoTable, "Địa chỉ giao hàng:", order.getAddress());
        }

        addInfoRow(infoTable, "Loại đơn:", order.isPickUp() ? "Tại quán" : "Giao hàng");

        document.add(infoTable);

        document.add(new Paragraph("CHI TIẾT ĐƠN HÀNG")
                .setFontSize(14)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        Table itemsTable = new Table(new float[] { 50, 250, 80, 100, 120 });
        itemsTable.setWidth(UnitValue.createPercentValue(100));

        addTableHeader(itemsTable, "STT");
        addTableHeader(itemsTable, "Tên món");
        addTableHeader(itemsTable, "SL");
        addTableHeader(itemsTable, "Đơn giá");
        addTableHeader(itemsTable, "Thành tiền");

        int index = 1;
        for (OrderItem item : order.getOrderItems()) {
            addTableCell(itemsTable, String.valueOf(index++));
            addTableCell(itemsTable, item.getProduct() != null ? item.getProduct().getName() : "N/A");
            addTableCell(itemsTable, String.valueOf(item.getQuantity()));
            addTableCell(itemsTable, currencyFormat.format(item.getPrice()));
            addTableCell(itemsTable, currencyFormat.format(item.getPrice() * item.getQuantity()));
        }

        document.add(itemsTable);

        document.add(new Paragraph("TỔNG KẾT THANH TOÁN")
                .setFontSize(14)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        Table summaryTable = new Table(new float[] { 300, 200 });
        summaryTable.setWidth(UnitValue.createPercentValue(100));

        addSummaryRow(summaryTable, "Tạm tính:", currencyFormat.format(order.getSubTotal()));

        if (order.getShippingFee() != null && order.getShippingFee() > 0) {
            addSummaryRow(summaryTable, "Phí giao hàng:", currencyFormat.format(order.getShippingFee()));
        }

        if (order.getDiscountValue() > 0) {
            addSummaryRow(summaryTable, "Giảm giá:", "- " + currencyFormat.format(order.getDiscountValue()));
        }

        if (order.getPointUsed() > 0) {
            addSummaryRow(summaryTable, "Điểm sử dụng:", "- " + order.getPointUsed() + " điểm");
        }

        Cell totalLabelCell = new Cell()
                .add(new Paragraph("TỔNG CỘNG:").setBold().setFontSize(14))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setPadding(10);
        Cell totalValueCell = new Cell()
                .add(new Paragraph(currencyFormat.format(order.getAmount())).setBold().setFontSize(14))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setPadding(10)
                .setTextAlignment(TextAlignment.RIGHT);

        summaryTable.addCell(totalLabelCell);
        summaryTable.addCell(totalValueCell);

        document.add(summaryTable);

        document.add(new Paragraph("MÃ QR ĐƠN HÀNG")
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30));

        try {
            byte[] qrCodeBytes = qrCodeService.generateOrderQRCode(order.getId());
            if (qrCodeBytes != null && qrCodeBytes.length > 0) {
                Image qrCodeImage = new Image(ImageDataFactory.create(qrCodeBytes));
                qrCodeImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                qrCodeImage.setWidth(100);
                qrCodeImage.setHeight(100);
                document.add(qrCodeImage);
            } else {
                System.err.println("QR code bytes is null or empty for order " + order.getId());
            }
        } catch (Exception e) {
            System.err.println("Failed to generate QR code for order " + order.getId() + ": " + e.getMessage());
            e.printStackTrace();
            // Continue without QR code - bill will still be generated
        }

        document.add(new Paragraph("Cảm ơn quý khách đã sử dụng dịch vụ!")
                .setFontSize(12)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20));

        document.close();

        return baos.toByteArray();
    }

    private void addInfoRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()).setBorder(null));
        table.addCell(new Cell().add(new Paragraph(value)).setBorder(null));
    }

    private void addTableHeader(Table table, String text) {
        Cell cell = new Cell()
                .add(new Paragraph(text).setBold())
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setPadding(5)
                .setTextAlignment(TextAlignment.CENTER);
        table.addHeaderCell(cell);
    }

    private void addTableCell(Table table, String text) {
        Cell cell = new Cell()
                .add(new Paragraph(text))
                .setPadding(5)
                .setTextAlignment(TextAlignment.CENTER);
        table.addCell(cell);
    }

    private void addSummaryRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label)).setPadding(5));
        table.addCell(new Cell()
                .add(new Paragraph(value))
                .setPadding(5)
                .setTextAlignment(TextAlignment.RIGHT));
    }
}
