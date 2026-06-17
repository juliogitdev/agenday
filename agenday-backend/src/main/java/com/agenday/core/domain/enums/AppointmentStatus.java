package com.agenday.core.domain.enums;

public enum AppointmentStatus {
    /**
     * O agendamento foi realizado com sucesso e está aguardando o horário acontecer.
     * Esse status bloqueia a grade de horários do profissional.
     */
    SCHEDULED,

    /**
     * O cliente compareceu e o profissional concluiu o atendimento com sucesso.
     */
    COMPLETED,

    /**
     * O agendamento foi cancelado (pelo cliente ou pelo estabelecimento) antes do horário.
     * Libera os blocos de 15 minutos de volta para a grade.
     */
    CANCELED,

    /**
     * O horário do atendimento passou, o profissional ficou aguardando,
     * mas o cliente não compareceu (Falta).
     */
    NO_SHOW
}