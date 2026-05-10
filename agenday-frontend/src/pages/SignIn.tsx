
import React from "react";
// import AuthContext from "../context/AuthContext";
import styles from './styles/login.module.css';
import { EmailInput } from "../components/inputs/EmailInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { SolidButton } from "../components/buttons/SolidButton";
import { GoogleLogin } from "@react-oauth/google";

export function Login() {
	// const {login} = React.useContext(AuthContext);
	const [email, setEmail] = React.useState<string>("");
	const [passw, setPassw] = React.useState<string>("");

	const loginWithEmail = () => {
		if (email && passw) {
			// enviar as crendencias para o backend e receber o token de autenticação
		}
	}

	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	const loginWithGoogle = (credentialResponse: any) => {
		if (credentialResponse.credential) {
			// enviar o token do Google para o backend e receber o token de autenticação do Agenday
		}
	}

	return (
		<div className={styles.loginPage}>
			<div className={styles.loginContainer}>
				<div className={styles.loginForm}>
					<img src="/resource/icons/agenday_logo_v1.svg" alt="Agenday Logo" className={styles.logo} />
					<h2 className={styles.loginTitle}>
						Login 
						<span className={styles.loginSubtitle}>
							Acesse sua conta para gerenciar seu dia.
						</span>
					</h2>

					<EmailInput email={email} onChange={setEmail} />
					<PasswordInput password={passw} onChange={setPassw}/>
					
					<div className={styles.spacer} ></div>
					<div className={styles.spacer} ></div>
					<SolidButton text="Entrar na plataforma" isActive={!!email && !!passw} onClick={loginWithEmail} />
					
					<div className={styles.spacer} ></div>
					<GoogleLogin onSuccess={loginWithGoogle} onError={() => {}} />
					
					<div className={styles.spacer} ></div>
					<a href="/register" className={styles.registerLink}>
						Não tem uma conta? <span className={styles.registerText}>Registre-se</span>
					</a>
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