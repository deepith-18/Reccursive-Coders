package com.company.placement.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * High-performance sliding-window token bucket rate limiter filter.
 * Protects auth login endpoints (max 15 req/min) and code execution (max 30 req/min).
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // Map: clientKey (IP + endpoint) -> WindowCounter
    private final Map<String, WindowCounter> requestCounts = new ConcurrentHashMap<>();

    private static final int AUTH_LIMIT_PER_MINUTE = 15;
    private static final int EXECUTION_LIMIT_PER_MINUTE = 30;
    private static final int GENERAL_LIMIT_PER_MINUTE = 120;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);

        int maxLimit = getLimitForPath(path);
        String bucketKey = clientIp + ":" + (path.startsWith("/api/v1/auth/login") ? "auth" : (path.contains("/submissions/") ? "exec" : "gen"));

        long currentMinute = System.currentTimeMillis() / 60000;
        WindowCounter counter = requestCounts.compute(bucketKey, (k, v) -> {
            if (v == null || v.windowMinute != currentMinute) {
                return new WindowCounter(currentMinute, new AtomicInteger(1));
            }
            v.counter.incrementAndGet();
            return v;
        });

        if (counter.counter.get() > maxLimit) {
            log.warn("Rate limit exceeded for client IP [{}] on path [{}] (count={}/{})", clientIp, path, counter.counter.get(), maxLimit);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", "60");
            response.setHeader("X-RateLimit-Limit", String.valueOf(maxLimit));
            response.setHeader("X-RateLimit-Remaining", "0");

            String json = String.format(
                    "{\"status\":429,\"errorCode\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Rate limit exceeded. Please wait 60 seconds before retrying.\",\"path\":\"%s\",\"timestamp\":\"%s\"}",
                    path, Instant.now().toString()
            );
            response.getWriter().write(json);
            return;
        }

        response.setHeader("X-RateLimit-Limit", String.valueOf(maxLimit));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, maxLimit - counter.counter.get())));

        filterChain.doFilter(request, response);
    }

    private int getLimitForPath(String path) {
        if (path.contains("/auth/login")) return AUTH_LIMIT_PER_MINUTE;
        if (path.contains("/submissions/run") || path.contains("/submissions/submit")) return EXECUTION_LIMIT_PER_MINUTE;
        return GENERAL_LIMIT_PER_MINUTE;
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }

    private static class WindowCounter {
        final long windowMinute;
        final AtomicInteger counter;

        WindowCounter(long windowMinute, AtomicInteger counter) {
            this.windowMinute = windowMinute;
            this.counter = counter;
        }
    }
}
