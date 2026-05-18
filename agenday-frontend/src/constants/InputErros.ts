
export const INPUT_ERRORS = {
	NAME: {
		EMPTY: "O nome não pode ser vazio.",
		TOO_SHORT: "precisar ter pelo menos 5 caracteres.",
		INVALID_CHARACTERS: "deve conter apenas letras e espaços.",
		TOO_LONG: "excedeu 50 caracteres."
	},
	EMAIL: {
		INVALID: "E-mail inválido"
	},
	
	PHONE: {
		INVALID_FORMAT: "fomato inválido",
		INVALID_LENGTH: "deve conter entre 10 e 11 dígitos."
	},
	LOCATION: {
		REQUIRED: "A localização é obrigatória."
	},
	
	PASSWORD: {
		TOO_SHORT: "deve conter +8 caracteres.",
		MISSING_UPPERCASE: "deve conter 1+ letras maiúscula.",
		MISSING_LOWERCASE: "deve conter 1+ letras minúscula.",
		MISSING_NUMBER: "deve conter pelo menos um número.",
		MISSING_SPECIAL_CHAR: "deve conter 1+ caractere especial."
	}
};