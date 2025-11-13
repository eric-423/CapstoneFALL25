package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.Order;
import com.capstone.tamtech.capstone.repositories.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderBillService {

    private static final Logger logger = LoggerFactory.getLogger(OrderBillService.class);

    @Autowired
    private PdfBillService pdfBillService;

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Autowired
    private OrderRepository orderRepository;

    @Async
    @Transactional
    public void generateAndUploadBill(int orderId) {
        try {
            logger.info("Starting bill generation for order {}", orderId);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

            logger.info("Generating PDF for order {}", orderId);
            byte[] pdfBytes = pdfBillService.generateBill(order);

            logger.info("Uploading PDF to Supabase for order {}", orderId);
            String pdfUrl = supabaseStorageService.uploadOrderBill(pdfBytes, orderId);

            order.setBillPdfUrl(pdfUrl);
            orderRepository.save(order);

            logger.info("Bill generated and uploaded successfully for order {}. URL: {}", orderId, pdfUrl);

        } catch (Exception e) {
            logger.error("Failed to generate/upload bill for order {}: {}", orderId, e.getMessage(), e);
        }
    }

    public byte[] generateBillPdf(int orderId) throws Exception {
        logger.info("Generating PDF for order {} (synchronous)", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        return pdfBillService.generateBill(order);
    }

    @Transactional
    public void regenerateBill(int orderId) throws Exception {
        logger.info("Regenerating bill for order {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (order.getBillPdfUrl() != null && !order.getBillPdfUrl().isEmpty()) {
            try {
                String fileName = order.getBillPdfUrl().substring(order.getBillPdfUrl().lastIndexOf("/") + 1);
                supabaseStorageService.deleteFile(fileName);
            } catch (Exception e) {
                logger.warn("Failed to delete old bill: {}", e.getMessage());
            }
        }

        byte[] pdfBytes = pdfBillService.generateBill(order);
        String pdfUrl = supabaseStorageService.uploadOrderBill(pdfBytes, orderId);

        order.setBillPdfUrl(pdfUrl);
        orderRepository.save(order);

        logger.info("Bill regenerated successfully for order {}. New URL: {}", orderId, pdfUrl);
    }
}
