
import React from "react";
import type { UserLogged, UserLogin, UserSignup } from "../types/User";
import AuthContext from "../context/AuthContext";

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = React.useState<UserLogged | null>(null);
	const [loginType, setLoginType] = React.useState<string>('email');

	const login = async (userData: UserLogin, loginType: string): Promise<number> => {
		const API_URL = import.meta.env.VITE_API_URL;
		setLoginType(loginType);
		
		if (loginType == 'email') {	
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email:    userData.email, 
						password: userData.password
					})
				});
				console.log(await response.json());
			} catch (error) { return 500; /* Internal Server Error */ }

			if (response.ok && response.status == 200 ) {
				const data = await response.json();
				setUser({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					type: data.type
				});
			} 
			return response.status;
		} 
		
		if (loginType == 'google') {
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/google`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						googleToken: userData.googleToken
					})
				});
			} catch (error) { return 500; /* Internal Server Error */ }

			if (response.ok && response.status == 200 ) {
				const data = await response.json();
				setUser({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					type: data.type
				});
			} 
			return response.status;
		}

		return 0;
	};

	const signup = async (userData: UserSignup, loginType: string): Promise<number> => {
		const API_URL = import.meta.env.VITE_API_URL;
		if (loginType == 'email') {
			let response: Response;
			try {
				response = await fetch(`${API_URL}auth/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						fullName: userData.fullName,
						email:    userData.email, 
						password: userData.password,
						numberPhone: userData.numberPhone,
						state: userData.state,
						city: userData.city,
					})
				});
			} 
			catch (error) { return 500; /* Internal Server Error */ } 
			return response.status;
		}

		return 0;
	};

	const logout = async(): Promise<number> => { setUser(null); return 100;};
	
	return (
		<AuthContext.Provider value={{ user, loginType, login, logout, signup }}>
			{ children } 
		</AuthContext.Provider>
	);
}
