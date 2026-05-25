
/**
 *
 * @author roberto-xz
 */

package com.agenday.establishment.interfaces.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.agenday.establishment.application.dto.ImageUploadResponse;
import com.agenday.iam.infrastructure.storage.MinioStorageService;

@RestController
@RequestMapping("/api/v1/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {
	private final MinioStorageService minioStorageService;
	
	ImageUploadController(MinioStorageService minioStorageService) {
		this.minioStorageService = minioStorageService;
	}

	@PostMapping("/image-url")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSIONAL','CLIENT')")
	public ResponseEntity<ImageUploadResponse> requestUploadUrl( 
		@RequestParam String folder, 
		@RequestParam String extension
	) 

	throws Exception {
        return ResponseEntity.ok(minioStorageService.generateUploadUrl(folder,extension));
    }
}
