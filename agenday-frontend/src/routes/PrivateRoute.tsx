
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
	const { user } = useContext(AuthContext);
	return user ? <>{children}</> : <Navigate to="/login" replace />;
}