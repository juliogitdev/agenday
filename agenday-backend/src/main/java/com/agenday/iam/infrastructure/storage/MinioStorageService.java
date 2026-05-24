
/**
 *
 * @author roberto-xz
 */

package com.agenday.iam.infrastructure.storage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.agenday.establishment.application.dto.ImageUploadResponse;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.http.Method;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
public class MinioStorageService {
	private final MinioClient minioClient;
    @Value("${spring.minio.image-bucket}") private String bucket;

    public String upload(MultipartFile file) throws Exception {
        String fileName ="avatars/"+ UUID.randomUUID()+ "-"+ file.getOriginalFilename();
        
		minioClient.putObject(
			PutObjectArgs.builder().bucket(bucket)
                    .object(fileName)
                    .stream(file.getInputStream(),file.getSize(),-1)
					.contentType(file.getContentType()).build()
        );
        return fileName;
    }

	public ImageUploadResponse generateUploadUrl(String folder, String extension) throws Exception {
		switch(folder){
   			case "establishments":
   			case "users":
       				break;
   			default:
       			throw new IllegalArgumentException("Invalid upload folder destination");
		}

    	String fileName =folder + UUID.randomUUID()+ "."+ extension;
    	String uploadUrl =
            minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Method.PUT)
                .bucket(bucket)
                .object(fileName)
                .expiry(1,TimeUnit.MINUTES).build()
			);
    		return new ImageUploadResponse(uploadUrl,fileName
    	);
	}

	public void delete(String fileName) throws Exception {
    	minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(fileName).build());
	}
}
