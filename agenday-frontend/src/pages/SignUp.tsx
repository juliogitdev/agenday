
import { useContext, useRef } from "react";
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
import { type CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { validateEmail, validateName, validatePhone } from "../utils/Validations";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { MESSAGES, statusMap } from "../constants/messages";
import type { UserSignup } from "../types/User";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";


export function SignUp() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const {user, signup} = useContext(AuthContext);
	const timerRef = useRef<number | null>(null);
	
	const [alertMessage, setAlertMessage] = React.useState<string>("");
	const [showAlert, setShowAlert] = React.useState<boolean>(false);
	const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);

	const [alertTitle, setAlertTitle] = React.useState<string>("error");
	const [bntIsloading, setBtnIsLoading] = React.useState<boolean>(false);

	const [email, setEmail] = React.useState<string>("");
	const [passw, setPassw] = React.useState<string>("");
	const [name, setName] = React.useState<string>("");
	const [phone, setPhone] = React.useState<string>("");
	const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
	const [location, setLocation] = React.useState<{uf: string; city: string} | null>(null);

	const navigate = useNavigate();
	if (user) {  navigate('/home');}

	function validateForm() {
		const emailV = validateEmail(email);
		const nameV = validateName(name);
		const phoneV = validatePhone(phone);
		const locationValid =
			location !== null &&
			location.uf?.trim() !== "" &&
			location.city?.trim() !== "";
		const isValid =
			emailV.isValid &&
			nameV.isValid &&
			phoneV.isValid &&
			passw.trim() !== "" &&
			passw.trim().length >= 6 &&
			locationValid &&
			termsAccepted;

		return {
			isValid,
			fields: {
				email: emailV,
				name: nameV,
				phone: phoneV
			}
		};
	}

	const form = validateForm();
	
	const signUpWithEmail = async () => {
		if ( form.isValid ) {
			setBtnIsLoading(true);
			const user:UserSignup = {
				fullName: name, email,
				password: passw, numberPhone: phone,
				state: location?.uf ?? '', city: location?.city ?? '',
			}

			const status = await signup(user, 'email');
			if (status === 201 || status === 200 ) {
				setBtnIsLoading(false);
				setShowSuccessAlert(true);
				setShowAlert(false);
				setTimeout(() => {navigate('/login')}, 3000);
				return;
			}

			const key = statusMap[status] ?? "unknownError";
			const msg = MESSAGES[key];
			showAlertWithMessage(msg.title, msg.message);
		}
	}

	const loginWithGoogle = async (credentialResponse: CredentialResponse) => {
		if (credentialResponse.credential && credentialResponse.clientId ) {
			const status = await signup({googleId: credentialResponse.clientId}, 'google');
			if (status === 200) {
				setBtnIsLoading(true); // mantem o loading para evitar clique duplo
				setShowSuccessAlert(true);
				setTimeout(() => navigate('/home'), 2000);
				return;
			}
			const key = statusMap[status] ?? "unknownError";
			const msg = MESSAGES[key];
			showAlertWithMessage(msg.title, msg.message);
		} 
		else {  onLoginGoogleError(); }
	}


	const showAlertWithMessage = (title: string, message: string) => {
		const signupContainer = document.querySelector(`.${styles.signupContainer}`) as HTMLElement | null;
		if (!signupContainer){ return; }

		signupContainer.classList.remove(styles.shake);
		void signupContainer.offsetWidth;
		signupContainer.classList.add(styles.shake);

		setAlertTitle(title);
		setAlertMessage(message);
		setShowAlert(true);

		if (timerRef.current){ clearTimeout(timerRef.current);}

		timerRef.current = setTimeout(() => {
			setShowAlert(false);
			setBtnIsLoading(false);
			signupContainer.classList.remove(styles.shake);
		}, 3000);
	};

	const onLoginGoogleError = () => {
		const msg = MESSAGES["googleLoginError"];
		showAlertWithMessage(msg.title, msg.message);
	}

	return (
		<GoogleOAuthProvider clientId={googleClientId}> 
			{ showAlert && <ErrorAlert title={alertTitle} message={alertMessage}/>}
			{ showSuccessAlert && <SuccessAlert title="Sucesso!" message="Conta criada com sucesso. redirecionando para o login..." /> }

			<div className={styles.signupMobileHeader}>
				<img src="/resource/icons/agenday_logo_v1.svg" alt="Agenday" className={styles.signupMobileLogo} />
				<span className={styles.signupMobileTitle}> Seu Tempo, sob controle</span>
			</div>

			<div className={styles.signupPage}>
				<div className={styles.signupContainer}>
					<div className={styles.signupForm}>
						<div className={styles.inputGroup}>
							<NameInput  name={name}   onChange={setName} />
							<PhoneInput phone={phone} onChange={setPhone} />
							<EmailInput email={email} onChange={setEmail} />
							<PasswordInput password={passw} onChange={setPassw} showRecovery={false} />
						</div>
						
						<LocationInput onChose={(location) => setLocation(location)} />
						<TermsOfUserCheckbox 
							termsLink="/terms-of-use" 
							onChange={(a) => {setTermsAccepted(a)}} 
						/>
						<div className={styles.spacer} ></div>
						<div className={styles.spacer} ></div>

						<SolidButton 
							text="Criar Conta" 
							isActive={form.isValid}	  
							onClick={signUpWithEmail} 
							isLoading={bntIsloading}
						/>
						<div className={styles.spacer}></div>
						<GoogleLogin 
							onSuccess={loginWithGoogle} 
							onError={onLoginGoogleError} 
							text="continue_with"
						/>
						
						<div className={styles.spacer}></div>
						<button className={styles.loginLink} onClick={() => navigate('/signin')}>
							Já tem uma conta? <span className={styles.loginText}>Faça login</span>
						</button>
					</div>
					<div className={styles.leftSide}>
						<h2 className={styles.leftSideTitle}>
							crie sua conta no <span className={styles.leftSideSpan}>agenday.</span>
						</h2>
						<p className={styles.leftSideText}>	
							Seja você um profissional ou um cliente, o Agenday é a plataforma ideal para gerenciar seus compromissos de forma fácil e eficiente.
						</p>
					</div>
				</div>
				<p className={styles.copyright}>
					© {new Date().getFullYear()} Agenday Platform. Todos os direitos reservados.
				</p>
			</div>
		</GoogleOAuthProvider>
	);
}