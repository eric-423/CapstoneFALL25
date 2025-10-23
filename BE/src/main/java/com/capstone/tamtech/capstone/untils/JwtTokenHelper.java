package com.capstone.tamtech.capstone.untils;

import com.capstone.tamtech.capstone.entities.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenHelper {
    @Value("${jwt.secretkey}")
    private String key;

    public String generateToken(Users user, String roleName, Long time) {
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(key));
        String token = Jwts.builder()
                .issuer("TamTechRestaurant")
                .subject("JWT Token")
                .claim("role", roleName)
                .claim("name", user.getFullName())
                .claim("address", user.getAddress())
                .claim("id", user.getId())
                .claim("phone", user.getPhoneNumber())
                .claim("email", user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date((new Date().getTime()) + time))
                .signWith(secretKey).compact();
        return token;
    }

    public long getExpirationTime(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(key));
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getExpiration().getTime();
    }

    public boolean verifyToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(key));
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Claims getClaimsFromToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(key));
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
