package com.capstone.tamtech.capstone.services;


import com.capstone.tamtech.capstone.services.impl.MailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    public MailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public Boolean sendOtpEmail(String to, String otpCode) throws Exception {
        Context context = new Context();
        context.setVariable("OTP_CODE", otpCode);
        System.out.println("🔔 OTP Code to send: " + otpCode);

        String htmlContent = templateEngine.process("otp-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

        helper.setFrom("your_email@gmail.com");
        helper.setTo(to);
        helper.setSubject("Mã xác thực Tấm Tắc của bạn");
        helper.setText(htmlContent, true); // true = HTML

        mailSender.send(message);
        System.out.println("✅ Đã gửi OTP tới " + to);

        return true;
    }
}
