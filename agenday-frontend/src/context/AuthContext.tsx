
import { createContext } from 'react';
import type { UserLogged, UserLogin, UserSignup } from '../types/User';

type AuthContextType = {
	user: UserLogged | null;
	loginType: string;
	authReady: boolean;
	refreshToken: () => Promise<boolean>;
  	login: (userData: UserLogin, loginType: string) => Promise<number>;
  	signup: (userData: UserSignup, loginType: string) => Promise<number>;
  	logout:() => Promise<number>;
};

const AuthContext = createContext<AuthContextType>({
  	user: null,
	loginType: 'email',
	authReady: false,
	refreshToken: async () => false,
  	login: async () => -0,
	signup: async () => 0,
	logout: async () => 0,
});

export default AuthContext;