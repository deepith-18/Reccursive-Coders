package com.company.placement.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class RateLimitingFilterTest {

    private RateLimitingFilter rateLimitingFilter;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        rateLimitingFilter = new RateLimitingFilter();
        filterChain = mock(FilterChain.class);
    }

    @Test
    void testAllowedRequestsPassThrough() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/health");
        request.setRemoteAddr("192.168.1.10");
        MockHttpServletResponse response = new MockHttpServletResponse();

        rateLimitingFilter.doFilterInternal(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getHeader("X-RateLimit-Limit")).isNotNull();
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void testRateLimitExceededOnAuthEndpoint() throws ServletException, IOException {
        String testIp = "10.0.0.99";

        // Auth endpoint limit is 15 req/min
        for (int i = 1; i <= 15; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/v1/auth/login");
            req.setRemoteAddr(testIp);
            MockHttpServletResponse res = new MockHttpServletResponse();
            rateLimitingFilter.doFilterInternal(req, res, filterChain);
            assertThat(res.getStatus()).isEqualTo(200);
        }

        // 16th request must trigger HTTP 429
        MockHttpServletRequest overLimitReq = new MockHttpServletRequest("POST", "/api/v1/auth/login");
        overLimitReq.setRemoteAddr(testIp);
        MockHttpServletResponse overLimitRes = new MockHttpServletResponse();

        rateLimitingFilter.doFilterInternal(overLimitReq, overLimitRes, filterChain);

        assertThat(overLimitRes.getStatus()).isEqualTo(429);
        assertThat(overLimitRes.getHeader("Retry-After")).isEqualTo("60");
        assertThat(overLimitRes.getContentAsString()).contains("RATE_LIMIT_EXCEEDED");
    }
}
