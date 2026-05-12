
import React, { useRef } from "react";
import AuthContext from "../context/AuthContext";
import styles from './styles/signin.module.css';
import { EmailInput } from "../components/inputs/EmailInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { SolidButton } from "../components/buttons/SolidButton";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../components/Alerts/ErrorAlert";
import { MESSAGES } from "../constants/messages";

export function SignIn() {
	const {login} = React.useContext(AuthContext);
	const timerRef = useRef<number | null>(null);
	const navigate = useNavigate();

	const [alertMessage, setAlertMessage] = React.useState<string>("");
	const [showAlert, setShowAlert] = React.useState<boolean>(false);
	const [alertTitle, setAlertTitle] = React.useState<string>("error");
	const [bntIsloading, setBtnIsLoading] = React.useState<boolean>(false);

	const [email, setEmail] = React.useState<string>("");
	const [passw, setPassw] = React.useState<string>("");

	const [passwValid, setPasswValid] = React.useState<boolean>(false);
	const [emailValid, setEmailValid] = React.useState<boolean>(false);
	
	const validEmail    = (value: string, isValid: boolean) => { setEmailValid(isValid); setEmail(value);}
   	const validPassword = (value: string, isValid: boolean) => { setPasswValid(isValid); setPassw(value);}
	
	const statusMap: Record<number, keyof typeof MESSAGES> = {
		500: "serverError",
		401: "invalidCredentials",
		400: "invalidCredentials",
		403: "invalidCredentials",
	};

	const loginWithEmail = async () => {
		if (email && passw) {
			setBtnIsLoading(true);
			const status = await login({password: passw, email: email}, 'email');
			if (status === 200) return;

			const key = statusMap[status] ?? "unknownError";
			const msg = MESSAGES[key];
			showAlertWithMessage(msg.title, msg.message);
		}
	}

	const loginWithGoogle = async (credentialResponse: any) => {
		if (credentialResponse.credential) {
			const status = await login({email: '', googleToken: credentialResponse.credential}, 'google');
			if (status === 200) return;

			const key = statusMap[status] ?? "unknownError";
			const msg = MESSAGES[key];
			showAlertWithMessage(msg.title, msg.message);
		}
	}


				
	const showAlertWithMessage = (title: string, message: string) => {
		const loginContainer = document.querySelector(`.${styles.loginContainer}`) as HTMLElement | null;
		if (!loginContainer) return;

		loginContainer.classList.remove(styles.shake);
		void loginContainer.offsetWidth;
		loginContainer.classList.add(styles.shake);

		setAlertTitle(title);
		setAlertMessage(message);
		setShowAlert(true);

		if (timerRef.current) clearTimeout(timerRef.current);

		timerRef.current = setTimeout(() => {
			setShowAlert(false);
			setBtnIsLoading(false);
			loginContainer.classList.remove(styles.shake);
		}, 3000);
	};

	return (
		<div className={styles.loginPage}>
			 { showAlert && <ErrorAlert title={alertTitle} message={alertMessage}/>}
			<div className={styles.loginContainer}>
				<div className={styles.loginForm}>
					<h2 className={styles.loginTitle}>
						Login 
						<span className={styles.loginSubtitle}>
							Acesse sua conta para gerenciar seu dia.
						</span>
					</h2>

					<EmailInput email={email} onChange={validEmail} />
					<PasswordInput password={passw} onChange={validPassword}/>
					
					<div className={styles.spacer} ></div>
					<div className={styles.spacer} ></div>
					<SolidButton text="Entrar na plataforma" 
						isActive={ emailValid && passwValid} 
						onClick={loginWithEmail} 
						isLoading={bntIsloading}
					/>
					
					<div className={styles.spacer} ></div>
					<GoogleLogin onSuccess={loginWithGoogle} onError={() => {}} />
					
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