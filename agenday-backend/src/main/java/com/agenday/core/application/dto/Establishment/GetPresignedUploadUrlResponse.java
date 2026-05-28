package com.agenday.core.application.dto.Establishment;

public record GetPresignedUploadUrlResponse(
    String uploadUrl,
    String filename
) { }
