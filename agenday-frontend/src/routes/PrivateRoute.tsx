

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
	const { user, authReady } = useContext(AuthContext);
	
	// enquanto authReady for false, a aplicação ainda está tentando
	// restaurar a sessão do usuário através do refresh token.
	if (!authReady) return <div>Loading...</div>;

	// se authReady for true e user for null, o usuário não está autenticado.
	return user ? <>{children}</> : <Navigate to="/login" replace />;
}