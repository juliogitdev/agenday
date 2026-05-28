
package com.agenday.iam.infrastructure.Store;
import io.minio.*;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URI;
import java.util.concurrent.TimeUnit;

/**
 * Serviço MinIO com suporte a signed URLs corretas por ambiente.
 *
 * O truque de reescrita abaixo garante que:
 * - Em DEV: a signed URL aponta para http://localhost:9000/...
 * - Em PROD: a signed URL aponta para https://storage.agenday.com/...
 *
 * O MinioClient gera a URL usando o 'endpoint' configurado (que em PROD
 * é http://minio:9000, inacessível externamente). Reescrevemos o host
 * para 'publicBaseUrl' antes de retornar ao cliente.
 */
@Service
public class MinioStorageService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    @Value("${minio.bucket.images}")
    private String imagesBucket;

    @Value("${minio.bucket.files}")
    private String filesBucket;

    public MinioStorageService(MinioClient minioClient, MinioConfig minioConfig) {
        this.minioClient = minioClient;
        this.minioConfig = minioConfig;
    }

    public String generatePresignedUploadUrl(String bucket, String objectName, int expiryMinutes) throws Exception {
        String internalUrl = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder().method(Method.PUT)
                    .bucket(bucket)
                    .object(objectName)
                    .expiry(expiryMinutes, TimeUnit.MINUTES)
                    .build()
        );
        return internalUrl;
        //return rewriteToPublicUrl(internalUrl);
    }


    /**
     * Reescreve o host+scheme da URL gerada internamente pelo MinioClient
     * para o domínio público configurado em minio.public-base-url.
     *
     * Exemplo:
     *   internalUrl  = http://minio:9000/agenday-images/foto.jpg?X-Amz-...
     *   publicBase   = https://storage.agenday.com
     *   resultado    = https://storage.agenday.com/agenday-images/foto.jpg?X-Amz-...
     */
//    private String rewriteToPublicUrl(String internalUrl) {
//        try {
//            URI internal = URI.create(internalUrl);
//            URI publicBase = URI.create(minioConfig.getPublicBaseUrl());
//
//            URI rewritten = new URI(
//                    publicBase.getScheme(),
//                    publicBase.getAuthority(),
//                    internal.getPath(),
//                    internal.getQuery(),
//                    null
//            );
//            return rewritten.toString();
//        } catch (Exception e) {
//            return internalUrl;
//        }
//    }
}
