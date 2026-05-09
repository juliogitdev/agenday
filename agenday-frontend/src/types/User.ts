
export type User = {
  	id: number;
  	name: string;
  	email: string;
  	fullName: string;
	numberPhone: string;
};

export type UserLogin = {
  	name: string;
	password?: string;
  	email: string;
	googleId?: string;
};