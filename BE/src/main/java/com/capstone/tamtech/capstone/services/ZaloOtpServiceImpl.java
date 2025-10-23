package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.services.impl.ZaloOtpService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class ZaloOtpServiceImpl implements ZaloOtpService {

    @Value("${zalo.url}")
    private String url;
    @Value("${zalo.loginName}")
    private String loginName;
    @Value("${zalo.sign}")
    private String sign;
    @Value("${zalo.serviceTypeId}")
    private int serviceTypeId;
    @Value("${zalo.brandName}")
    private String brandName;

    @Override
    public boolean sendOtp(String otp, String phone) {
        boolean isDone = false;
        HttpURLConnection con = null;
        try {
            String requestUrl = url + "?sign=" + sign + "&loginName=" + loginName + "&serviceTypeId=" + serviceTypeId + "&brandName=" + brandName + "&phoneNumber=" + phone + "&message=" + otp;
            System.out.println(requestUrl);
            URL obj = new URL(requestUrl);
            con = (HttpURLConnection) obj.openConnection();

            con.setRequestMethod("GET");
            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                isDone = true;
            } else {
                System.out.println("Yêu cầu không thành công, mã phản hồi: " + responseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }
        return isDone;
    }


}
