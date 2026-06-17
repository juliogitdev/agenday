package com.agenday.core.repository.Appointment;

import com.agenday.core.domain.model.Appointment.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    /**
     * Busca o histórico de agendamentos ativos de um cliente específico.
     */
    List<Appointment> findByCustomerIdAndIsActiveTrueOrderByStartTimeDesc(UUID customerId);

    /**
     * Busca todos os agendamentos confirmados de um profissional em um intervalo de tempo.
     */
    List<Appointment> findByProfessionalEstablishmentIdAndStartTimeBetweenAndIsActiveTrue(
            UUID professionalEstabId,
            LocalDateTime start,
            LocalDateTime end
    );

    /**
     * Concorrência (Intersecção de Timestamps)
     * Verifica se o novo agendamento que o cliente tenta fazer bate de frente
     * com algum agendamento que JÁ EXISTE, está ATIVO e CONFIRMADO (SCHEDULED).
     * * Lógica matemática da intersecção: (Novo_Inicio < Fim_Existente) E (Novo_Fim > Inicio_Existente)
     */
    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
            "WHERE a.professionalEstablishment.id = :professionalEstabId " +
            "AND a.status = 'SCHEDULED' " +
            "AND a.isActive = true " +
            "AND :startTime < a.endTime " +
            "AND :endTime > a.startTime")
    boolean existsAppointmentConflict(
            @Param("professionalEstabId") UUID professionalEstabId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
