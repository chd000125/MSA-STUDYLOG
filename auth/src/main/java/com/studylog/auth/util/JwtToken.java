package com.studylog.auth.util;

import com.studylog.auth.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class JwtToken {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-validity-in-seconds}")
    private long accessTokenValidityInSeconds;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;

    public String generateAccessToken(User user) {
        return generateAccessToken(user, accessTokenValidityInSeconds);
    }

    public String generateRefreshToken(User user) {
        return generateRefreshToken(user, refreshTokenValidityInSeconds);
    }

    private String generateAccessToken(User user, long validityInSeconds) {
        Claims claims = Jwts.claims().setSubject(user.getuEmail());
        claims.put("uEmail", user.getuEmail());
        claims.put("uName", user.getuName());
        claims.put("uRole", user.getuRole());

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInSeconds * 1000);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateRefreshToken(User user, long validityInSeconds) {
        Claims claims = Jwts.claims().setSubject(String.valueOf(user.getuId()));
        claims.put("uId", user.getuId());

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInSeconds * 1000);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getuId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("uId", Long.class);
    }

}
