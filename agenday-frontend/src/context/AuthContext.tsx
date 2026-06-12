
import { createContext } from 'react';
import type { UserLogged, UserLogin, UserSignup } from '../types/User';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

type AuthContextType = {
	user: UserLogged | null;
	loginType: string;
    api: AxiosInstance;
	authReady: boolean;
	setUser: React.Dispatch<React.SetStateAction<UserLogged | null>>;
	refreshSession: () => Promise<boolean>;
  	login: (userData: UserLogin, loginType: string) => Promise<number>;
  	signup: (userData: UserSignup, loginType: string) => Promise<number>;
  	logout:() => Promise<number>;
};


const axio_default = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

const AuthContext = createContext<AuthContextType>({
  	user: null,
	loginType: 'email',
	authReady: false,
    api: axio_default,
	setUser: () => {},
	refreshSession: async () => false,
  	login: async () => -0,
	signup: async () => 0,
	logout: async () => 0,
});

export default AuthContext;
