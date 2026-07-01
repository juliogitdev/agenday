package com.agenday.communication.domain.event.user;

import com.agenday.communication.domain.event.DomainEvent;
import com.agenday.communication.domain.event.EventType;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EventType("user.registered")
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@Getter
public class UserRegistredEvent extends DomainEvent {
    private final UUID userId;
    private final String userName;
    private final String email;
}
