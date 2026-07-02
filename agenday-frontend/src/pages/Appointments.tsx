
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { ProfessionalsAppoointmentsPage } from "./Appointments/ProfessionalsAppoointmentsPage";
import { jwtDecode } from "jwt-decode";
import type { AgendaJwt } from "../types/Jwt";
import { ClientsAppoointmentsPage } from "./Appointments/ClientsAppoointmentsPage";


export function Appointments() {
	const {user} = useContext(AuthContext);
	if (user != null) { 
		const userData: AgendaJwt = jwtDecode(user.accessToken || "");
		const userRoles = userData.roles ?? []; 
		return (
			userRoles.includes("ROLE_PROFESSIONAL") ? <ProfessionalsAppoointmentsPage /> : <ClientsAppoointmentsPage/>
		)
	}
}