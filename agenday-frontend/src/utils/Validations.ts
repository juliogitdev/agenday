
export const valid = {
	email: (value: string):string | null => {
		const cleanValue = value.trim();
		if ( cleanValue === '') { return 'O e-mail é obrigatório.';}
		if (cleanValue !== '') {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (!emailRegex.test(cleanValue)) { return 'Por favor, insira um e-mail válido.';}
			const hasHtmlOrScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(cleanValue) || /[<>]/g.test(cleanValue);
			if (hasHtmlOrScript) { return 'Há caracteres inválidos no e-mail.';}
		}
		return null; 
	},
	password: (value: string): string | null => {
		if (!value || value === '') {  return 'Digite uma senha forte'; }
		if (value.length < 8) { return 'mínimo 8 caracteres necessário.';}
		const hasUpperCase = /[A-Z]/.test(value);
		const hasNumber = /[0-9]/.test(value);
		const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

		if (!hasUpperCase) {return "Inclua um caractere maiúsculo."}
		if (!hasNumber) {return "Inclua um número."}
		if (!hasSpecialChar) {return "Inclua um caractere especial."}
		
		const hasHtmlOrScript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value) || /[<>]/g.test(value);
		const hasSqlAttack = /[\'\"]\s*(or|and)\s*[\'\"]?\d/i.test(value) || /union\s+select/i.test(value);
	
		if (hasHtmlOrScript || hasSqlAttack) {
			return 'formato inválido';
		}
		return null;
	},

	textField: (value: string): string | null => {
		const cleanValue = value ? value.trim() : '';
		if (cleanValue === '') { return 'Este campo é obrigatório.';}
		if (cleanValue !== '') {
			if (cleanValue.length > 90) { return `Limite máximo de 90 caracteres`;}
			const hasHtmlOrScript = 
				/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(cleanValue) || 
				/[<>]/g.test(cleanValue) || 
				/javascript:/gi.test(cleanValue);
		
			const hasSql = 
				/[\'\"]\s*(or|and)\s*[\'\"]?\d/i.test(cleanValue) || 
				/union\s+select/i.test(cleanValue) || 
				/drop\s+table/i.test(cleanValue) ||
				/delete\s+from/i.test(cleanValue);

			if (hasHtmlOrScript) { return 'O campo contém caracteres inválidos';}
			if (hasSql) { return 'O campo contém caracteres inválidos';}
		}
		return null;
	},


	phone: (value: string): string | null => {
		const cleanValue = value ? value.trim() : '';
		if (cleanValue === '') { return 'Telefone é obrigatório.';}
		if (cleanValue !== '') {
			const phoneRegex = /^[0-9\s\-()+]{8,20}$/;
			if (!phoneRegex.test(cleanValue)) { return 'Formato inválido';}
		}
		return null;
	},

	cep: (value: string): string | null => {
		const cleanValue = value ? value.trim() : '';
		if (cleanValue === '') { return 'CEP é obrigatório.';}
		if (cleanValue !== '') {
			const cepRegex = /^\d{5}-\d{3}$/;
			if (!cepRegex.test(cleanValue)) { return 'Formato inválido';}
		}
		return null;
	}
};



export function formatBRPhone(value: string): string {
	const numbers = value.replace(/\D/g, '');
	const truncated = numbers.slice(0, 11);
	if (truncated.length <= 2) { return truncated.length > 0 ? `(${truncated}` : '';}
	if (truncated.length <= 6) { return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;}
	if (truncated.length <= 10) {
		return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 6)}-${truncated.slice(6)}`;
	}

	return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
}


export type Field = {
	value: any;
	errorMessage: string | null;
	isValid: boolean;
};

const messages: Record<string, {title: string, description: string}> = {
	"address.cep": {
		title: "CEP inválido",
		description: "O CEP informado é inválido."
	},
	"address.city": {
		title: "Cidade",
		description: "Preencha a cidade."
	},
	"address.state": {
		title: "Estado",
		description: "Preencha o estado."
	},
	"address.street": {
		title: "Rua",
		description: "Preencha a rua."
	},
	"address.number": {
		title: "Número",
		description: "Preencha o número."
	},
	"address.neighborhood": {
		title: "Bairro",
		description: "Preencha o bairro."
	},
	"basicInfo.name": {
		title: "Nome do estabelecimento",
		description: "Preencha o nome do estabelecimento."
	},
	"basicInfo.numberPhone": {
		title: "Telefone",
		description: "Preencha o telefone."
	},
	"basicInfo.category": {
		title: "Categoria",
		description: "Selecione uma categoria."
	},
	"basicInfo.manager": {
		title: "Responsável",
		description: "Preencha o responsável."
	},
	"visual.palette": {
		title: "Paleta",
		description: "Selecione uma paleta."
	},
	"visual.image": {
		title: "Imagem",
		description: "Adicione uma imagem."
	}
};


export function validateFields(
	obj: any,
	path = ""
): {title: string, description: string} | null {

	for (const key in obj) {
		const currentPath = path
			? `${path}.${key}`
			: key;

		const value = obj[key];

		// é um campo final
		if (
			value &&
			typeof value === "object" &&
			"value" in value &&
			"isValid" in value
		) {
			if (!value.isValid) {
				return messages[currentPath] || {
					title: "Campo inválido",
					description: `Corrija ${currentPath}`
				};
			}
		}

		// continua navegando
		else if (
			value &&
			typeof value === "object"
		) {
			const error = validateFields(
				value,
				currentPath
			);

			if (error) return error;
		}
	}

	return null;
}