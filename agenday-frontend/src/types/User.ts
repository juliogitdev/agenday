
export type User = {
  	token: number;
  	name: string;
  	email: string;
	image: string,
  	fullName: string;
	numberPhone: string;
};

export type UserLogged = {
  	accessToken: string;
    type: string;
};

export type UserLogin = {
	email?: string;
	password?: string;
	googleId?: string;
};

export type UserSignup = {
	fullName?: string;	
	googleId?: string;
	email?: string;
	password?: string;
	numberPhone?: string;
	state?: string;
	city?: string;
};