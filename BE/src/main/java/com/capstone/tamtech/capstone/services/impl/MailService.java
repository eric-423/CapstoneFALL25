package com.capstone.tamtech.capstone.services.impl;

public interface MailService {
   Boolean sendOtpEmail(String to, String otpCode) throws Exception;
}
