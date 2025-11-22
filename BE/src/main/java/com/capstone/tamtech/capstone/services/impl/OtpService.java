package com.capstone.tamtech.capstone.services.impl;


public interface OtpService {
     boolean sendOtp(String channel, String identifier) throws Exception;
     boolean verifyOtp(String channel, String identifier, String inputOtp);
     long getOtpTtlSeconds(String channel, String identifier);
     boolean verifyOtpForForgotPassword(String channel, String identifier, String inputOtp, boolean isDelete);
}
