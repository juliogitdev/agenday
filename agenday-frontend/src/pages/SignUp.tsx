
import { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from './styles/signup.module.css';
import { EmailInput } from "../components/inputs/EmailInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { TextInput } from "../components/inputs/TextInput";
import { PhoneInput } from "../components/inputs/PhoneInput";
import { LocationInput } from "../components/inputs/LocationInput";
import { SolidButton } from "../components/buttons/SolidButton";
import { TermsOfUserCheckbox } from "../components/checkbox/TermsOfUseCheckbox";
import { type CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { MESSAGES, statusMap } from "../constants/messages";
import type { UserSignup } from "../types/User";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import type { InputCallback } from "../types/Inputs";
import type { Location } from "../types/Location";

export function SignUp() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const {user, signup} = useContext(AuthContext);
	const timerRef = useRef<number | null>(null);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>("error");
	const [bntIsloading, setBtnIsLoading] = useState<boolean>(false);
	const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
	const [email, setEmail] = useState<InputCallback>({value: "", errorMessage: null, isValid: false});
	const [passw, setPassw] = useState<InputCallback>({value: "", errorMessage: null, isValid: false});
	const [uname, setUname] = useState<InputCallback>({value: "", errorMessage: null, isValid: false});
	const [phone, setPhone] = useState<InputCallback>({value: "", errorMessage: null, isValid: false});
	const [location, setLocation] = useState<InputCallback<Location>>({value: { uf: "", city: "" },  errorMessage: null, isValid: false});

	const navigate = useNavigate();
	if (user) {  navigate('/home');}
	
	const signUpWithEmail = async () => {
		if ( isValidForm () ) {
			setBtnIsLoading(true);
			const user:UserSignup = {
				fullName: uname.value, email: email.value,
				password: passw.value, numberPhone: phone.value,
				state: location.value?.uf ?? '', city: location.value?.city ?? '',
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


	

	const isValidForm = (): boolean => {
		return email.isValid && passw.isValid && uname.isValid && phone.isValid && location.isValid;
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
							<TextInput  label="Nome" placeholder="Ex. João Silva dos santos" onChangeField={(e)=>setUname(e)}/>
							<PhoneInput label="Telefone" onChangeField={(e)=>setPhone(e)} />
							<EmailInput label="Email" placeholder="Ex. user@email.com" onChangeField={(e)=>setEmail(e)}/>
							<PasswordInput label="Senha" placeholder="Senha" onChangeField={(e)=>setPassw(e)}/>
						</div>
						
						<LocationInput 
							initialValue={location.value}
							showBanner={true} 
							onChangeField={setLocation} />
					
						<TermsOfUserCheckbox 
							termsLink="/terms-of-use" 
							onChange={(a) => {setTermsAccepted(a)}} 
						/>
						<div className={styles.spacer} ></div>
						<div className={styles.spacer} ></div>

						<SolidButton 
							isActive={isValidForm() && termsAccepted}
							text="Criar Conta"  
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