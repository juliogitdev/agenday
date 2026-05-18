

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Panel } from "../layouts/Panel";


export function PrivateRoute({children,}: {children: React.ReactNode;}) {
	const { user, authReady } = useContext(AuthContext);
	
	// enquanto authReady for false, a aplicação ainda está tentando
	// restaurar a sessão do usuário através do refresh token.
	if (!authReady) { return <div>Loading...</div>;}

	// se authReady for true e user for null, o usuário não está autenticado.
	if (!user) { return <Navigate to="/login" replace />;}

	return (
		<main className="appMain">
			<Panel /> 
			<section style={{flex: "1"}}> {children} </section>
		</main>
	);

}








