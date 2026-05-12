
export type User = {
  	token: number;
  	name: string;
  	email: string;
  	fullName: string;
	numberPhone: string;
};

export type UserLogged = {
  	accessToken: string;
    refreshToken: string;
    type: string;
};

export type UserLogin = {
	email: string;
	password?: string;
	googleToken?: string;
};

export type UserSignup = {
	fullName: string;	
	email: string;
	password: string;
	numberPhone: string;
	state: string;
	city: string;
};