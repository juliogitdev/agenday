
import React from "react";
import type { User, UserLogin } from "../types/User";
import AuthContext from "../context/AuthContext";
import { SignIn } from "../pages/SignIn";


export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = React.useState<User | null>(null);

	const login = (userData: UserLogin) => {
		const user: User = {
			id: 1,
			name: userData.name,
			email: userData.email,
			fullName: userData.name,
			numberPhone: ""
		};

		setUser(user);
	};

	const logout = () => { setUser(null);};
	
	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{ user ? children : <SignIn/> }
		</AuthContext.Provider>
	);
}
