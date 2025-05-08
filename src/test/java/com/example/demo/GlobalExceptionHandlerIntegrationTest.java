package com.example.demo;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class GlobalExceptionHandlerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testDbError_shouldBeHandledByGlobalExceptionHandler() throws Exception{
        mockMvc.perform(post("/test-db-error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("資料庫錯誤"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void testMissingSessionIdCookie() throws Exception {
        // 建立一個假的請求 JSON
        String requestBody = """
            {
              "wordId": 123
            }
            """;

        mockMvc.perform(post("/UserWord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("使用者請求未附上所要求的cookie"))
                .andExpect(jsonPath("$.message").exists());
    }
}
