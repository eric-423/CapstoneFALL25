package com.capstone.tamtech.capstone.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

        @Autowired
        private EndpointCounter endpointCounter;

        @Bean
        public OpenAPI customOpenAPI() {
                SecurityScheme securityScheme = new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("JWT Authentication")
                                .description("Nhập JWT token để xác thực. Token có thể lấy được từ API đăng nhập.");

                SecurityRequirement securityRequirement = new SecurityRequirement()
                                .addList("bearerAuth");

                return new OpenAPI()
                                .info(new Info()
                                                .title("TamTech Restaurant API")
                                                .version("1.0.0")
                                                .description("API cho hệ thống quản lý nhà hàng TamTech. " +
                                                                "Hệ thống hỗ trợ quản lý khách hàng, nhân viên, đơn hàng, sản phẩm và các chức năng liên quan.\n\n"
                                                                +
                                                                "**📊 Thống kê:** Tổng số endpoints đang được tính toán...\n\n"
                                                                +
                                                                "**Hướng dẫn sử dụng:**\n" +
                                                                "1. Đăng nhập bằng API `/api/auth/customer/login` hoặc `/api/auth/employee/login`\n"
                                                                +
                                                                "2. Copy JWT token từ response\n" +
                                                                "3. Click nút 'Authorize' ở góc trên bên phải\n" +
                                                                "4. Nhập token vào ô 'Value' (không cần thêm 'Bearer')\n"
                                                                +
                                                                "5. Sử dụng các API được bảo vệ\n\n" +
                                                                "**Lưu ý:** Token có thời gian hết hạn, cần đăng nhập lại khi token hết hạn.")
                                                .contact(new Contact()
                                                                .name("TamTech Support Team")
                                                                .email("support@tamtech.com")
                                                                .url("https://tam-tac.com"))
                                                .license(new License()
                                                                .name("Apache 2.0")
                                                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                                .servers(List.of(
                                                new Server()
                                                                .url("http://localhost:8080")
                                                                .description("Development Server"),
                                                new Server()
                                                                .url("https://tam-tac.com")
                                                                .description("Production Server")))
                                .components(new Components()
                                                .addSecuritySchemes("bearerAuth", securityScheme))
                                .addSecurityItem(securityRequirement);
        }

        @Bean
        public OpenApiCustomizer openApiCustomizer() {
                return openApi -> {
                        int totalEndpoints = endpointCounter.countEndpoints();
                        String description = "API cho hệ thống quản lý nhà hàng TamTech. " +
                                        "Hệ thống hỗ trợ quản lý khách hàng, nhân viên, đơn hàng, sản phẩm và các chức năng liên quan.\n\n"
                                        +
                                        "**📊 Thống kê:** Tổng số endpoints: **" + totalEndpoints + "**\n\n" +
                                        "**Hướng dẫn sử dụng:**\n" +
                                        "1. Đăng nhập bằng API `/api/auth/customer/login` hoặc `/api/auth/employee/login`\n"
                                        +
                                        "2. Copy JWT token từ response\n" +
                                        "3. Click nút 'Authorize' ở góc trên bên phải\n" +
                                        "4. Nhập token vào ô 'Value' (không cần thêm 'Bearer')\n" +
                                        "5. Sử dụng các API được bảo vệ\n\n" +
                                        "**Lưu ý:** Token có thời gian hết hạn, cần đăng nhập lại khi token hết hạn.";
                        openApi.getInfo().setDescription(description);
                };
        }
}
