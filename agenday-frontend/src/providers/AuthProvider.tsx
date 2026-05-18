
import React from "react";
import type { UserLogged, UserLogin, UserSignup } from "../types/User";
import AuthContext from "../context/AuthContext";

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = React.useState<UserLogged | null>(null);
	const [authReady, setAuthReady] = React.useState(false);
	const [loginType, setLoginType] = React.useState<string>('email');

	const login = async (userData: UserLogin, loginType: string): Promise<number> => {
		const API_URL = import.meta.env.VITE_API_URL;
		setLoginType(loginType);
		
		// tenta logar com email+senha
		if (loginType === 'email' && userData.email && userData.password ) {	
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/login`, {
					method: 'POST',
					credentials: "include",
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email:    userData.email, 
						password: userData.password
					})
				});
			} catch { return 500;}

			if (response.ok && response.status === 200 ) {
				const data = await response.json();
				setUser({ accessToken: data.accessToken, type: data.type});
			}
 
			return response.status;
		} 

		// tenta logar com google
		if (loginType === 'google' && userData.googleId) {
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/google`, {
					method: 'POST',
					credentials: "include",
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({idToken: userData.googleId})
				});
			} catch { return 500;}

			if (response.ok && response.status === 200 ) {
				const data = await response.json();
				setUser({ accessToken: data.accessToken, type: data.type});
			} 
			return response.status;
		}

		return 1;
	};


	const signup = async (userData: UserSignup, loginType: string): Promise<number> => {
		const API_URL = import.meta.env.VITE_API_URL;

		// tenta cadastrar com email+senha
		if (loginType === 'email' 
				&& userData.email 
				&& userData.password
				&& userData.fullName
				&& userData.numberPhone
				&& userData.state
				&& userData.city
		) {
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						fullName: userData.fullName, email:       userData.email, 
						password: userData.password, numberPhone: userData.numberPhone,
						state:    userData.state,    city:        userData.city,
					})
				});
			} 
			catch { return 500; }
			return response.status;
		} 

		// tenta cadastrar com google
		else if (loginType === 'google' && userData.googleId) {
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/google`, {
					method: 'POST',
					credentials: "include",
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({idToken: userData.googleId})
				});
			} catch { return 500;}

			if (response.ok && response.status === 200 ) {
				const data = await response.json();
				setUser({ accessToken: data.accessToken, type: data.type});
			} 
			return response.status;
		}

		return 1;
	};


	const refreshToken = async(): Promise<boolean> => { 
		const API_URL = import.meta.env.VITE_API_URL;
		try {
			const response = await fetch(`${API_URL}auth/refresh`, {
				method: 'POST',
				credentials: "include",
			});

			if (response.ok && response.status === 200) {
				const data = await response.json();
				setUser({accessToken: data.accessToken, type: data.type});
				return true;
			}
           setUser(null);
		   return false;
		}
		catch { return false; }
	};


	const logout = async(): Promise<number> => { 
		const API_URL = import.meta.env.VITE_API_URL;
		try {
			const response = await fetch(`${API_URL}auth/logout`, {
				method: 'POST',
				credentials: "include",
			});

			if (response.ok && response.status === 200) {
				setUser(null);
				return 200;
			}
		}
		catch { return 500; }
		return 500;
	};


	// realiza uma tentativa de refresh automático ao iniciar a aplicação.
	// authReady evita renderizar rotas protegidas antes da validação da sessão.
	React.useEffect(() => {
		const initAuth = async () => {
			await refreshToken();
			await new Promise(resolve => setTimeout(resolve, 1000)); // simula delay de carregamento
			setAuthReady(true);
		};
		initAuth();
	}, []);
	
	return (
		<AuthContext.Provider value={{
			 user, 
			 loginType, 
			 login, 
			 logout, 
			 signup, 
			 refreshToken, 
			 authReady 
		}}>
			{ children } 
		</AuthContext.Provider>
	);
}

