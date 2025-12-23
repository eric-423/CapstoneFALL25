package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.services.impl.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class OrderScheduledTaskService {

    private static final Logger logger = LoggerFactory.getLogger(OrderScheduledTaskService.class);

    @Autowired
    private OrderService orderService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void autoCompleteDeliveredOrders() {
        try {
            logger.info("Starting auto-complete delivered shipping orders task at 00:00");
            orderService.autoCompleteDeliveredShippingOrders();
            orderService.autoCompleteDiningOrders();
            logger.info("Auto-complete delivered shipping orders task completed successfully");
        } catch (Exception e) {
            logger.error("Error in auto-complete delivered shipping orders task: {}", e.getMessage(), e);
        }
    }
}
