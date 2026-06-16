package com.agenday.core.repository.Professional;

import com.agenday.core.domain.model.Professional.ProfessionalSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProfessionalScheduleRepository extends JpaRepository<ProfessionalSchedule, UUID> {

    /**
     * Busca toda a jornada semanal ativa de um profissional em um estabelecimento.
     */
    List<ProfessionalSchedule> findByProfessionalEstablishmentIdAndIsActiveTrue(UUID professionalEstabId);

    /**
     * Trava de Concorrência e Sobreposição de Turnos.
     * Verifica se o novo turno que o profissional tenta cadastrar bate de frente
     * com algum turno que já existe e está ativo no mesmo dia da semana.
     */
    @Query("SELECT COUNT(ps) > 0 FROM ProfessionalSchedule ps " +
            "WHERE ps.professionalEstablishment.id = :professionalEstabId " +
            "AND ps.dayOfWeek = :dayOfWeek " +
            "AND ps.isActive = true " +
            "AND :startTime < ps.endTime " +
            "AND :endTime > ps.startTime")
    boolean existsScheduleConflict(
            @Param("professionalEstabId") UUID professionalEstabId,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}