
import React, { useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import styles from './styles/signin.module.css';
import { EmailInput } from "../components/inputs/EmailInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { SolidButton } from "../components/buttons/SolidButton";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { MESSAGES, statusMap } from "../constants/messages";
import { MESSAGES, statusMap } from "../constants/messages";
import { SuccessAlert } from "../components/Alerts/SuccessAlert";
import type { InputCallback } from "../types/Inputs";

export function SignIn() {
	const {login} = React.useContext(AuthContext);
	const timerRef = useRef<number | null>(null);
	const navigate = useNavigate();

	const [alertMessage, setAlertMessage] = React.useState<string>("");
	const [showAlert, setShowAlert] = React.useState<boolean>(false);
	const [showSuccessAlert, setShowSuccessAlert] = React.useState<boolean>(false);

	const [alertTitle, setAlertTitle] = React.useState<string>("error");
	const [bntIsloading, setBtnIsLoading] = React.useState<boolean>(false);

	const [email, setEmail] = useState<InputCallback>({value: "", errorMessage: null, isValid: false});
	const [passw, setPassw] = useState<InputCallback>({value: "", errorMessage: null, isValid: false});


	const loginWithEmail = async () => {
		if (email.isValid && passw.isValid) {
			setBtnIsLoading(true);
			const status = await login({password: passw.value, email: email.value}, 'email');
			if (status === 200)  {
				setBtnIsLoading(true); // mantem o loading para evitar clique duplo
				setShowSuccessAlert(true);
				setTimeout(() => navigate('/home'), 2000);
				return;
			}

			const key = statusMap[status] ?? "unknownError";
			const msg = MESSAGES[key];
			showAlertWithMessage(msg.title, msg.message);
		}
	}

	const loginWithGoogle = async (credentialResponse: CredentialResponse) => {
		if (credentialResponse.credential) {
			const status = await login({googleId: credentialResponse.clientId}, 'google');
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
		else { onLoginGoogleError();}
	}
				
	const showAlertWithMessage = (title: string, message: string) => {
		const loginContainer = document.querySelector(`.${styles.loginContainer}`) as HTMLElement | null;
		if (!loginContainer){ return; }

		loginContainer.classList.remove(styles.shake);
		void loginContainer.offsetWidth;
		loginContainer.classList.add(styles.shake);

		setAlertTitle(title);
		setAlertMessage(message);
		setShowAlert(true);

		if (timerRef.current){ clearTimeout(timerRef.current);}

		timerRef.current = setTimeout(() => {
			setShowAlert(false);
			setBtnIsLoading(false);
			loginContainer.classList.remove(styles.shake);
		}, 3000);
	};

	const onLoginGoogleError = () => {
		const msg = MESSAGES["googleLoginError"];
		showAlertWithMessage(msg.title, msg.message);
	}

	return (
		<div className={styles.loginPage}>
			 { showAlert && <ErrorAlert title={alertTitle} message={alertMessage}/>}
			 { showSuccessAlert && <SuccessAlert title="Sucesso!" message="Login realizado com sucesso. redirecionando..." /> }
			
			<div className={styles.loginMobileHeader}>
				<img src="/resource/icons/agenday_logo_v1.svg" alt="Agenday" className={styles.loginMobileLogo} />
				<span className={styles.loginMobileTitle}> Seu Tempo, sob controle</span>
			</div>
			<div className={styles.loginContainer}>
				<div className={styles.loginForm}>
					<h2 className={styles.loginTitle}>
						Login 
						<span className={styles.loginSubtitle}>
							Acesse sua conta para gerenciar seu dia.
						</span>
					</h2>

					<EmailInput label="Email" placeholder="Ex. user@email.com" onChangeField={(e)=>setEmail(e)}/>
					<PasswordInput label="Senha" placeholder="Digite uma senha segura" onChangeField={(e)=>setPassw(e)}/>
					
					<div className={styles.spacer} ></div>
					<div className={styles.spacer} ></div>
					<SolidButton text="Entrar na plataforma" 
						isActive={ email.isValid && passw.isValid} 
						onClick={loginWithEmail} 
						isLoading={bntIsloading}
					/>
					
					<div className={styles.spacer} ></div>
					<GoogleLogin onSuccess={loginWithGoogle} onError={onLoginGoogleError} />
					
					<div className={styles.spacer} ></div>
					<button className={styles.registerLink} onClick={() => navigate('/signup')}>
						Não tem uma conta? <span className={styles.registerText}>Registre-se</span>
					</button>
				</div>

				<div className={styles.leftSide}>
					<h2 className={styles.leftSideTitle}>
						tempo sob <span className={styles.leftSideSpan}>controle.</span>
					</h2>
					<p className={styles.leftSideText}>	
						Transforme agendamentos em progresso real. O dinamismo 
						que seu serviço exige com a precisão que seu cliente espera.
					</p>
				</div>
			</div>
			
			<p className={styles.copyright}>
				© {new Date().getFullYear()} Agenday Platform. Todos os direitos reservados.
			</p>
		</div>
	);
}