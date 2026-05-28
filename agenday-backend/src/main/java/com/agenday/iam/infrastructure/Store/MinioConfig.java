package com.agenday.iam.infrastructure.Store;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do cliente MinIO.
 *
 * DEV:  endpoint = http://localhost:9000
 *       publicBaseUrl = http://localhost:9000
 *
 * PROD: endpoint = http://minio:9000  (rede Docker interna — para upload/download server-side)
 *       publicBaseUrl = https://storage.agenday.com  (domínio público — usado em signed URLs)
 *
 * Por que dois valores?
 * O MinioClient usa o 'endpoint' para se conectar ao servidor (dentro da rede Docker).
 * Signed URLs geradas por presignedGetObject() precisam apontar para o domínio público,
 * pois serão abertas pelo navegador do usuário, que não tem acesso à rede Docker.
 *
 * MINIO_SERVER_URL no docker-compose.prod.yml faz o MinIO reescrever suas próprias URLs
 * para o domínio público — isso é suficiente quando o MinIO gera as URLs internamente.
 * Se você gera as URLs no Spring Boot, use 'publicBaseUrl' para substituir o host.
 */
@Configuration
public class MinioConfig {

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    /**
     * URL base pública para reescrita de signed URLs.
     * DEV:  http://localhost:9000
     * PROD: https://storage.agenday.com
     */
    @Value("${minio.public-base-url}")
    private String publicBaseUrl;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }

    public String getPublicBaseUrl() {
        return publicBaseUrl;
    }
}
