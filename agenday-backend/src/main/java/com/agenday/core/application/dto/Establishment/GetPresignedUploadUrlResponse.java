package com.agenday.core.application.dto.Establishment;

public record getPresignedUploadUrlResponse(
        String uploadUrl,
        String filename
) { }
