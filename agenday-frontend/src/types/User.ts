
export type User = {
  	uuid: number;
  	email: string;
  	fullName: string;
	profileImageUrl: string
};

export type UserLogged = {
  	accessToken: string;
	userInformations: User | null;
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