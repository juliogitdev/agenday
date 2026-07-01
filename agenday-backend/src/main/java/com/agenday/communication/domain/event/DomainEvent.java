package com.agenday.communication.domain.event;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@ToString
@Getter
@EqualsAndHashCode
@SuperBuilder
public abstract class DomainEvent {

    @Builder.Default
    private final UUID eventId = UUID.randomUUID();

    @Builder.Default
    private final Instant occurredAt = Instant.now();

    private final Integer version = 1;

    private final UUID correlationId;
    
    public String getEventType() {

        EventType annotation = getClass().getAnnotation(EventType.class);

        if (annotation == null) {
            throw new IllegalStateException(
                    "O evento " + getClass().getSimpleName() + " não possui @EventType.");
        }

        return annotation.value();
    }

}