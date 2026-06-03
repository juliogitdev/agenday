package com.agenday.core.domain.enums;

public enum EstablishmentCategory {
    BARBERSHOP("Barbearia"),
    BEAUTY_SALON("Salão de Beleza"),
    NAIL_SALON("Manicure e Pedicure"),
    ESTHETIC_CLINIC("Estética"),
    EYEBROW_STUDIO("Design de Sobrancelhas"),
    EYELASH_STUDIO("Extensão de Cílios"),
    HAIR_CLINIC("Tratamentos Capilares"),
    SPA("Spa"),
    MASSAGE_CENTER("Massoterapia"),
    TATTOO_STUDIO("Estúdio de Tatuagem"),
    PIERCING_STUDIO("Estúdio de Piercing"),
    MAKEUP_STUDIO("Maquiagem"),
    OTHER("Outros");
    private final String label;

    EstablishmentCategory(String label) {this.label = label;}
    public String getLabel() { return label;}
}
