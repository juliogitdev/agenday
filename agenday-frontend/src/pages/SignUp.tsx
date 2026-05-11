
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from './styles/signup.module.css';
import React from "react";
import { EmailInput } from "../components/inputs/EmailInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { NameInput } from "../components/inputs/NameInput";
import { PhoneInput } from "../components/inputs/PhoneInput";
import { LocationInput } from "../components/inputs/LocationInput";
import { SolidButton } from "../components/buttons/SolidButton";
import { TermsOfUserCheckbox } from "../components/checkbox/TermsOfUseCheckbox";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export function SignUp() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const {user} = useContext(AuthContext);
	const [email, setEmail] = React.useState<string>("");
	const [passw, setPassw] = React.useState<string>("");
	const [name, setName] = React.useState<string>("");
	const [phone, setPhone] = React.useState<string>("");
	const [location, setLocation] = React.useState<{uf: string; city: string} | null>(null);

	const navigate = useNavigate();

	// If the user is already authenticated, redirect to the main app page
	if (user) {  navigate('/agenday');}
	const loginWithGoogle = (credentialResponse: any) => {
		if (credentialResponse.credential) {
			// enviar o token do Google para o backend e receber o token de autenticação do Agenday
		}
	}

	return (
		<GoogleOAuthProvider clientId={googleClientId}> 
			<div className={styles.signupPage}>
				<div className={styles.signupContainer}>
					<div className={styles.signupForm}>
						<img src="/resource/icons/agenday_logo_v1.svg" alt="Agenday Logo" className={styles.logo} />
						<h2 className={styles.signupTitle}>
							Crie sua conta
							<span className={styles.signupSubtitle}>Encontre e agende os melhores serviços perto de você.</span>
						</h2>
						
						<div className={styles.inputGroup}>
							<NameInput name={name} onChange={setName} />
							<PhoneInput phone={phone} onChange={setPhone} />
							<EmailInput email={email} onChange={setEmail} />
							<PasswordInput password={passw} onChange={setPassw} showRecovery={false} />
						</div>
						
						<LocationInput onChose={setLocation} />
						<TermsOfUserCheckbox termsLink="/terms-of-use" onChange={(a) => {alert(a)}} />
						<div className={styles.spacer} ></div>
						<div className={styles.spacer} ></div>

						<SolidButton text="Criar Conta" isActive={!!email && !!passw && !!name && !!phone && !!location} onClick={() => {}} />
						<div className={styles.spacer}></div>
						<GoogleLogin 
							onSuccess={loginWithGoogle} 
							onError={() => {}} 
							text="continue_with"
						/>
						
						<div className={styles.spacer}></div>
						<button className={styles.loginLink} onClick={() => navigate('/signin')}>
							Já tem uma conta? <span className={styles.loginText}>Faça login</span>
						</button>
					</div>
					<div className={styles.leftSide}>
						<h2 className={styles.leftSideTitle}>
							Onde o tempo  <span className={styles.leftSideSpan}>ganha vida.</span>
						</h2>
						<p className={styles.leftSideText}>	
							Agenday é a plataforma que conecta você aos melhores serviços locais,
							transformando seu tempo em experiências inesquecíveis.
						</p>
					</div>
				</div>

			</div>
		</GoogleOAuthProvider>
	);
}