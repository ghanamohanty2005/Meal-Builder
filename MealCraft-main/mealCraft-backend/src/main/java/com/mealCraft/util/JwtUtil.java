package com.mealCraft.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "mealcraft-secret-key";
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in ms

    // ✅ Generate JWT Token for a given username
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    // ✅ Extract username from token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ Validate token structure and expiration
    public boolean validateToken(String token) {
        try {
            getClaims(token); // parse to ensure it's valid
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("❌ JWT expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("❌ JWT unsupported: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("❌ JWT malformed: " + e.getMessage());
        } catch (SignatureException e) {
            System.out.println("❌ JWT signature invalid: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("❌ JWT token is null or empty: " + e.getMessage());
        }
        return false;
    }

    // ✅ Internal method to get claims
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }
}
