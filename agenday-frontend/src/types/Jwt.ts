
export type AgendaJwt = {
	sub: string;
  	email: string;
  	name: string;
  	roles: string[];
  	iat: number;
  	exp: number;
};