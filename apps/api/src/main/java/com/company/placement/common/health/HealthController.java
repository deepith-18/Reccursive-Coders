package com.company.placement.common.health;

import com.company.placement.common.utils.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Platform health check and diagnostic endpoints")
public class HealthController {

    private final DataSource dataSource;
    private final Environment environment;

    public HealthController(DataSource dataSource, Environment environment) {
        this.dataSource = dataSource;
        this.environment = environment;
    }

    @GetMapping
    @Operation(summary = "Get platform health status", description = "Checks service uptime and database connectivity")
    public ResponseEntity<ApiResponse<HealthResponse>> checkHealth() {
        Map<String, Object> details = new HashMap<>();

        // Database probe
        boolean dbHealthy = false;
        String dbError = null;
        try (Connection connection = dataSource.getConnection()) {
            dbHealthy = connection.isValid(2);
            details.put("database", Map.of(
                    "status", dbHealthy ? "UP" : "DOWN",
                    "product", connection.getMetaData().getDatabaseProductName(),
                    "version", connection.getMetaData().getDatabaseProductVersion()
            ));
        } catch (Exception e) {
            dbError = e.getMessage();
            details.put("database", Map.of(
                    "status", "DOWN",
                    "error", dbError != null ? dbError : "Connection failed"
            ));
        }

        String overallStatus = dbHealthy ? "UP" : "DEGRADED";
        String[] activeProfiles = environment.getActiveProfiles();
        String profileName = activeProfiles.length > 0 ? String.join(",", activeProfiles) : "default";

        HealthResponse healthResponse = HealthResponse.builder()
                .status(overallStatus)
                .service("placement-api")
                .timestamp(Instant.now())
                .activeProfile(profileName)
                .details(details)
                .build();

        return ResponseEntity.ok(ApiResponse.ok("System health check completed", healthResponse));
    }
}
