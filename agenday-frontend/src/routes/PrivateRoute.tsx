

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Panel } from "../layouts/Panel";

export function PrivateRoute({children,}: {children: React.ReactNode;}) {
	const { user, setUser, authReady } = useContext(AuthContext);
	
	// mock para teste, remover depois
	setUser({
		accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGVzIjpbIlJPTEVfQ0xJRU5UIl19.8nXo7sHj3mLh6a9e7v8ZtqjKkKZl3b5u9X9X9X9X9",
		type: "email"
	});

	// enquanto authReady for false, a aplicação ainda está tentando
	// restaurar a sessão do usuário através do refresh token.

	if (!authReady) { return <div>Loading...</div>;}
	if (!user) { return <Navigate to="/login" replace />;}
	
	return (
		<main className="appMain">
			<Panel /> 
			<section style={{
				flex: "1", 
				maxHeight: "calc(100vh - 20px)", 
				overflow: "auto",
				boxShadow: "inset 0 -8px 8px -8px rgba(0,0,0,.15)"
			}}> 
				{children} 
			</section>
		</main>
	);

}








