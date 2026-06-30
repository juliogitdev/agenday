package com.agenday.communication.domain.event;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public abstract class DomainEvent {

    private final UUID eventId;

    private final Instant occurredAt;

    private final Integer version;

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