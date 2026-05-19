export const MESSAGES = {

	// 500
	serverError: {
		title: "Erro interno do servidor",
		message: "Ocorreu um erro inesperado no servidor. Tente novamente em alguns instantes."
	},

	// 400
	badRequest: {
		title: "Requisição inválida",
		message: "A solicitação enviada é inválida ou contém dados incorretos."
	},

	// 401
	invalidCredentials: {
		title: "Credenciais inválidas",
		message: "O e-mail ou a senha informados estão incorretos."
	},

	unauthorized: {
		title: "Não autenticado",
		message: "Você precisa estar autenticado para acessar este recurso."
	},

	// 403
	forbidden: {
		title: "Acesso negado",
		message: "Você não possui permissão para acessar este recurso."
	},

	// 404
	pageNotFound: {
		title: "API indisponível",
		message: "Não foi possível localizar o serviço solicitado."
	},

	// 405
	methodNotAllowed: {
		title: "Método não permitido",
		message: "O método utilizado nesta requisição não é suportado."
	},

	// 408
	requestTimeout: {
		title: "Tempo de requisição esgotado",
		message: "O servidor demorou para responder. Tente novamente."
	},

	// 409
	duplicateEmail: {
		title: "E-mail já cadastrado",
		message: "Já existe uma conta vinculada a este e-mail. Faça login ou utilize outro endereço."
	},

	// 422
	invalidFields: {
		title: "Campos inválidos",
		message: "Verifique os dados preenchidos e tente novamente."
	},

	// 429
	tooManyRequests: {
		title: "Muitas requisições",
		message: "Você realizou muitas tentativas em pouco tempo. Aguarde alguns instantes."
	},

	// oauth
	googleLoginError: {
		title: "Falha no login com Google",
		message: "Não foi possível autenticar sua conta Google no momento."
	},

	// rede
	networkError: {
		title: "Falha na conexão",
		message: "Não foi possível conectar ao servidor do Agenday. Verifique sua conexão ou tente novamente mais tarde."
	},

	// fallback
	unknownError: {
		title: "Erro inesperado",
		message: "Não foi possível concluir a operação. Tente novamente"
	}
};


export const statusMap: Record<number, keyof typeof MESSAGES> = {

	// fetch/network
	0: "networkError",

	// client
	400: "badRequest",
	401: "invalidCredentials",
	403: "forbidden",
	404: "pageNotFound",
	405: "methodNotAllowed",
	408: "requestTimeout",
	409: "duplicateEmail",
	422: "invalidFields",
	429: "tooManyRequests",

	// server
	500: "serverError",
	502: "serverError",
	503: "serverError",
	504: "serverError"
};