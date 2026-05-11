

export type Location = {
	uf: string;
	city: string;
}

export type UF = {
  	id: number;
  	sigla: string;
  	nome: string;
};

export interface City {
  id: number;
  nome: string;
}