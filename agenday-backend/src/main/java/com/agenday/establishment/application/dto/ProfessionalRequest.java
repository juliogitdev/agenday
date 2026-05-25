package com.agenday.establishment.application.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record ProfessionalRequest(
    @Size(max = 1000) String bio,
	@Size(max = 255) String instagramUrl,
    @Size(max = 500) String specializedIn,
	
	LocalDate workingSince, 
	UUID planId
) {}
