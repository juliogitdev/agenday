package com.agenday.core.application.dto.Establishment;

import com.agenday.core.application.dto.Address.AddressRequest;
import com.agenday.core.domain.enums.EstablishmentCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import jakarta.validation.constraints.Size;

public record EstablishmentRequest(

    @NotBlank(message = "O nome do estabelecimento é obrigatório.")
    @Size(min = 3, max = 100,  message = "O nome deve possuir entre 3 e 100 caracteres.")
    String name,

    @NotBlank(message = "O slogan é obrigatório.")
    @Size(min = 3, max = 150, message = "O slogan deve possuir entre 3 e 150 caracteres.")
    String slogan,

    @NotBlank(message = "O número de telefone é obrigatório.")
    @Size(min = 8, max = 20, message = "O número de telefone informado é inválido.")
    String numberPhone,

    String imageUrl,

    @NotNull(message = "Selecione uma categoria para o estabelecimento.")
    EstablishmentCategory category,

    @NotNull(message = "Selecione um modelo para o estabelecimento.")
    Short template,

    @NotBlank(message = "Selecione uma paleta de cores.")
    String palette,

    @NotNull(message = "O endereço é obrigatório.")
    @Valid
    AddressRequest addressRequest

) {}
