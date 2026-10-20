package com.company.placement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OpenApiExportTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void exportOpenApiSpec() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn();

        String openApiJson = result.getResponse().getContentAsString();

        // Write to apps/api/target/openapi.json
        Path targetPath = Paths.get("target", "openapi.json");
        Files.createDirectories(targetPath.getParent());
        Files.writeString(targetPath, openApiJson);

        // Also sync to apps/web/openapi.json for frontend client generation if directory exists
        Path webPath = Paths.get("..", "web", "openapi.json");
        if (webPath.getParent() != null && Files.exists(webPath.getParent())) {
            Files.writeString(webPath, openApiJson);
        }
    }
}
