
import { createContext } from 'react';
import type { User, UserLogin } from '../types/User';

type AuthContextType = {
	user: User | null;
  	login: (userData: UserLogin) => void;
  	logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  	user: null,
  	login: ()  => {},
  	logout: () => {},
});

export default AuthContext;