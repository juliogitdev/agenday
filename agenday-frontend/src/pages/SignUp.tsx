import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function SignUp() {
	const {user} = useContext(AuthContext);
	const navigate = useNavigate();

	if (user) { 
		navigate('/agenday');
	}

	return (
		<div>
			<h1>Sign Up</h1>
		</div>
	);
}