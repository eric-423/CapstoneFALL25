package com.capstone.tamtech.capstone.services;

import com.capstone.tamtech.capstone.entities.Users;
import com.capstone.tamtech.capstone.exception.ResourceNotFoundException;
import com.capstone.tamtech.capstone.repositories.UsersRepository;
import com.capstone.tamtech.capstone.repositories.VerifyCodeRepository;
import com.capstone.tamtech.capstone.services.impl.MailService;
import com.capstone.tamtech.capstone.services.impl.OtpService;
import com.capstone.tamtech.capstone.services.impl.ZaloOtpService;
import com.capstone.tamtech.capstone.untils.JwtTokenHelper;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class OtpServiceImpl implements OtpService {


    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private ZaloOtpService zaloOtpService;

    @Autowired
    private MailService mailService;

    @Autowired
    private StringRedisTemplate redis;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final Duration OTP_TTL = Duration.ofMinutes(2);
    private static final Duration SEND_LOCK_TTL = Duration.ofSeconds(45);
    private static final int OTP_LENGTH = 6;
    private static final int MAX_FAILS = 5;

    private String otpKey(String channel, String id) {
        return "otp:%s:%s".formatted(channel, id);
    }
    private String sendLockKey(String channel, String id) {
        return "otp:send_lock:%s:%s".formatted(channel, id);
    }
    private String failKey(String channel, String id) {
        return "otp:fail:%s:%s".formatted(channel, id);
    }

    private String generateNumericOtp(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) sb.append(secureRandom.nextInt(10));
        return sb.toString();
    }

    private String createAndStoreOtp(String channel, String identifier) {
        ValueOperations<String, String> ops = redis.opsForValue();

        String lockKey = sendLockKey(channel, identifier);
        if (Boolean.TRUE.equals(redis.hasKey(lockKey))) {
            throw new IllegalStateException("Bạn vừa yêu cầu OTP gần đây, vui lòng đợi " + SEND_LOCK_TTL.toSeconds() + "s");
        }

        String key = otpKey(channel, identifier);
        String otp = generateNumericOtp(OTP_LENGTH);

        ops.set(key, otp, OTP_TTL);

        ops.set(lockKey, "1", SEND_LOCK_TTL);

        String fk = failKey(channel, identifier);
        redis.delete(fk);


        return otp;
    }

    @Override
    public boolean verifyOtp(String channel, String identifier, String inputOtp) {
        ValueOperations<String, String> ops = redis.opsForValue();
        String key = otpKey(channel, identifier);
        String stored = ops.get(key);

        if (stored == null) return false;

        if (stored.equals(inputOtp)) {
            redis.delete(key);
            redis.delete(failKey(channel, identifier));

            if(channel.equals("zalo")){
                Users user = userRepository.findByPhoneNumber(identifier)
                        .orElseThrow(() -> new ResourceNotFoundException("Số điện thoại không tồn tại trong hệ thống"));
                user.setPhoneVerified(true);
                userRepository.save(user);

            } else if(channel.equals("email")){
                Users user = userRepository.findByEmail(identifier)
                        .orElseThrow(() -> new ResourceNotFoundException("Email không tồn tại trong hệ thống"));
                user.setEmailVerified(true);
                userRepository.save(user);
            }
            return true;
        } else {
            String fk = failKey(channel, identifier);
            Long fails = ops.increment(fk);
            if (fails != null && fails == 1L) {
                redis.expire(fk, OTP_TTL.getSeconds(), TimeUnit.SECONDS);
            }
            if (fails != null && fails >= MAX_FAILS) {
                redis.delete(key);
            }
            return false;
        }
    }

    @Override
    public boolean sendOtp(String channel, String identifier) throws Exception {
        String otp = createAndStoreOtp(channel, identifier);

        if(channel.equals("zalo")){
            Users user = userRepository.findByPhoneNumber(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Số điện thoại không tồn tại trong hệ thống"));
            return zaloOtpService.sendOtp(otp, identifier);

        } else if(channel.equals("email")){
            Users user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Email không tồn tại trong hệ thống"));
            return mailService.sendOtpEmail(identifier, otp);
        } else {
            throw new IllegalArgumentException("Kênh không hợp lệ");
        }
    }

    @Override
    public long getOtpTtlSeconds(String channel, String identifier) {
        Long ttl = redis.getExpire(otpKey(channel, identifier), TimeUnit.SECONDS);
        return ttl == null ? -2 : ttl;
    }

}
